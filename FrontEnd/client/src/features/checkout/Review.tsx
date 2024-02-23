import { Typography, Grid } from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import CartTable from "../cart/CartTable";
import CartSummary from "../cart/CartSummary";

export default function Review() {
    const {cart} = useAppSelector(state => state.cart);
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        {cart &&
        <CartTable items={cart.items} isCart={false} />}
        <Grid container>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <CartSummary />
          </Grid>
        </Grid>
      </>
    );
  }