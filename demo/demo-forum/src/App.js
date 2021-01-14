import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Web3 from 'web3';
import PushArtifact from "./contracts/Push.json"
import contractAddress from "./contracts/contract-address.json"
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

var web3 = new Web3('http://127.0.0.1:8545');
var contract = new web3.eth.Contract(PushArtifact.abi, contractAddress.push);

var pollDataInterval;



export default function App() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [userAddress, setUserAddress] = React.useState('')
  const [userBalance, setUserBalance] = React.useState(0);
  const [userList, setUserList] = React.useState([{
    name: 'U1 🔥',
    coins: 3000
  },
  {
    name: 'U2 ⭐️',
    coins: 2000
  },
  {
    name: 'U3 💯',
    coins: 1000
  }])



  React.useEffect(() => {

    // Starts a setInterval to poll for the user's balance on page load
    startPollingData();

  }, []);



  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Starts a setInterval to poll for the user's balance on page load
  function startPollingData() {
    pollDataInterval = setInterval(() => updateBalance(), 6000)

    //Runs once so we don't have to wait 6 seconds when page first loads
    updateBalance();
  }


  //Updates the user's balance on the leaderboard, adds the user if they're not on the leaderboard
  async function updateBalance() {
    var accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setUserAddress(accounts[19]);
    const results = await contract.methods.balanceOf(accounts[19]).call({ from: accounts[19] });
    setUserBalance(results);
    let user = userList.find(o => (o.name === accounts[19]))
    console.log(user);
    if (user === undefined) {
      const newList = userList;

      newList.push({ name: accounts[19], coins: results });
      setUserList([...newList]);
    }
    else {
      const newList = userList;
      let objIndex = newList.findIndex((obj => obj.name == accounts[19]));
      newList[objIndex].coins = results;
      setUserList([...newList]);

    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div style={{
      backgroundColor: '#11BAA7', height: '100vmin'
    }}>
      <div className={classes.grow}>
        <AppBar position="static" style={{ background: "#080808", color: 'white' }}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Hacker forum
          </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
      <Container>
        <div className={classes.root
        } >
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <Card className={classes.root} style={{ marginTop: '1rem' }}>
                <CardHeader
                  style={{ backgroundColor: '#33658A', color: 'white' }}
                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      R
                </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title="Hacker Meeting "
                  subheader="September 14, 2016"
                />

                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Please bring your main frames
              </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                      Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                      minutes.
                </Typography>
                    <Typography paragraph>
                      Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                      heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                      browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                      and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                      pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                      saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                </Typography>
                    <Typography paragraph>
                      Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                      without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                      medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                      again without stirring, until mussels have opened and rice is just tender, 5 to 7
                      minutes more. (Discard any mussels that don’t open.)
                </Typography>
                    <Typography>
                      Set aside off of the heat to let rest for 10 minutes, and then serve.
                </Typography>
                  </CardContent>
                </Collapse>
              </Card>
              <Card className={classes.root} style={{ marginTop: '1rem' }}>
                <CardHeader
                  style={{ backgroundColor: '#33658A', color: 'white' }}

                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      R
              </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title="Vaxocentrism lecture at Library"
                  subheader="September 15, 1966"
                />

                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    got memory leaks? you'll love this talk
            </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                      Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                      minutes.
              </Typography>
                    <Typography paragraph>
                      Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                      heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                      browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                      and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                      pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                      saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
                    <Typography paragraph>
                      Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                      without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                      medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                      again without stirring, until mussels have opened and rice is just tender, 5 to 7
                      minutes more. (Discard any mussels that don’t open.)
              </Typography>
                    <Typography>
                      Set aside off of the heat to let rest for 10 minutes, and then serve.
              </Typography>
                  </CardContent>
                </Collapse>
              </Card>
              <Card className={classes.root} style={{ marginTop: '1rem' }}>
                <CardHeader
                  style={{ backgroundColor: '#33658A', color: 'white' }}

                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      R
            </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title="Hello World!"
                  subheader="September 16, 1966"
                />

                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Samizdat your jargon file via crowdStore
          </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                      Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                      minutes.
            </Typography>
                    <Typography paragraph>
                      Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                      heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                      browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                      and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                      pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                      saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
                    <Typography paragraph>
                      Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                      without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                      medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                      again without stirring, until mussels have opened and rice is just tender, 5 to 7
                      minutes more. (Discard any mussels that don’t open.)
            </Typography>
                    <Typography>
                      Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
            <Grid item xs={3} style={{ marginTop: '1rem' }}>
              <Paper className={classes.paper}>
                <Typography variant="h6" noWrap>
                  Leaderboards
          </Typography>
                <Grid container spacing={1}>
                  {userList.map((user, index) =>
                    <>
                      <Grid item xs={6}>
                        <div>{index + 1}. {(user.name).substring(0, 42 - 35)}{index === 3 ? '...😁' : null} :</div>
                      </Grid>
                      <Grid item xs={6}>
                        <div>{user.coins} SEED💰</div>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
              <Button variant="contained" color="secondary" style={{ marginTop: '1rem', textAlign: 'center' }} target="_blank" href='http://localhost:3002'>Click here to learn how to earn SEEDs!</Button>
            </Grid>


          </Grid>
        </div>
      </Container>
    </div>
  );
}