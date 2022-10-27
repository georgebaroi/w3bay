import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useWeb3React } from "@web3-react/core";


export default function ProductCard() {
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  return (
    <>
    <Card style={{ width: "18rem" }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
        crossorigin="anonymous"
      />
      <Card.Img
        variant="top"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg"
      />
      <Card.Body>
        <Card.Title>Product</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        {!active ? (
                <Button>Connect Wallet For Purchase</Button>
              ) : (
                <Button variant="success">Buy Now</Button>
              )}
        
      </Card.Body>
    </Card>
    <br/>
    </>
  );
}
