import React from "react";
import { List } from "../../../../ui/components/List";
import { ListItem } from "../../../../ui/components/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export const TransactionList = ({ transactions }) => {
  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction.id} divider>
          <ListItemText
            primary={transaction.amount}
            secondary={transaction.type}
          />
        </ListItem>
      ))}
    </List>
  );
};
