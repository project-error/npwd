import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, Paper } from "@material-ui/core";
import { ImageDisplay } from "../images/ImageDisplay";
import { ListItem } from "../../../../ui/components/ListItem";
import ChatIcon from "@material-ui/icons/Chat";
import PhoneIcon from "@material-ui/icons/Phone";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "hidden",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "flex-start",
    width: "100%",
    marginTop: "3px",
  },
  content: {
    display: "flex",
    marginTop: "-10px",
    flexFlow: "column nowrap",
    width: "100%",
  },
  paper: {
    overflow: "auto",
    display: "flex",
    flexFlow: "column",
    alignItems: "flex",
    height: "auto",
    background: "#232323",
    marginBottom: 20,
  },
  header: {
    margin: 10,
  },
  headerTypo: {
    margin: 5,
  },
  desc: {
    padding: 10,
  },
}));

export const SelloutItem = (listing) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.root}>
      <div className={classes.content}>
        <Paper elevation={2} className={classes.paper}>
          <div className={classes.header}>
            <Typography className={classes.headerTypo} variant="h5">
              {listing.name}
            </Typography>
            <Typography
              className={classes.headerTypo}
              style={{ borderBottom: "1px solid #f44336" }}
            >
              {listing.number}
            </Typography>
          </div>
          <ImageDisplay imgURL={listing.img} />
          <Typography variant="h7" className={classes.desc}>
            {listing.description}
          </Typography>
          <div className={classes.postActions}>
            <Button>
              <ChatIcon style={{ color: "#f44336" }} />
            </Button>
            <Button>
              <PhoneIcon style={{ color: "#f44336" }} />
            </Button>
          </div>
        </Paper>
      </div>
    </ListItem>
  );
};
