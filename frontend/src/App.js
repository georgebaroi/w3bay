import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box,
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import ProductCard from "./productCard";
import MainCarousel from "./carousel";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react"

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  // handlepurchase for on click if active, create account and send to backend the ethID and create a modal for it 

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);

  return (
    <>
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/home">
              <Text
                margin="0"
                
                lineHeight="1.15"
                fontSize={[".25em", "2em", "1.5/2em", "10em"]}
                fontWeight="200"
                sx={{
                  background:
                    "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                w3bay
              </Text>
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/sell">Sell</Nav.Link>
              <Nav.Link href="/account">Account</Nav.Link>
            </Nav>
            <HStack>
            {!active ? (
                <br/>
              ) : (
                <Popover>
                <PopoverTrigger>
                  <Button>Account</Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Header</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                    {active && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button onClick={switchNetwork} isDisabled={!network}>
                  Switch Network
                </Button>
                <Select placeholder="Select network" onChange={handleNetwork}>
                  <option value="3">Ropsten</option>
                  <option value="4">Rinkeby</option>
                  <option value="42">Kovan</option>
                  <option value="1666600000">Harmony</option>
                  <option value="42220">Celo</option>
                </Select>
              </VStack>
            </Box>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack >
                <Button onClick={signMessage} isDisabled={!message}>
                  Sign Message
                </Button>
                <Input
                  placeholder="Set Message"
                  maxLength={20}
                  onChange={handleInput}
                  w="140px"
                />
                {signature ? (
                  <Tooltip label={signature} placement="bottom">
                    <Text>{`Signature: ${truncateAddress(signature)}`}</Text>
                  </Tooltip>
                ) : null}
              </VStack>
            </Box>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button  onClick={verifyMessage} isDisabled={!signature}>
                  Verify Message
                </Button>
                {verified !== undefined ? (
                  verified === true ? (
                    <VStack>
                      <CheckCircleIcon color="green" />
                      <Text>Signature Verified!</Text>
                    </VStack>
                  ) : (
                    <VStack>
                      <WarningIcon color="red" />
                      <Text>Signature Denied!</Text>
                    </VStack>
                  )
                ) : null}
              </VStack>
            </Box>
          </HStack>
        )}

                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
              )}
            </HStack>
            <HStack>
              {!active ? (
                <Button onClick={onOpen}>Connect Wallet</Button>
              ) : (
                <Button onClick={disconnect}>Disconnect</Button>
              )}
            </HStack>
          </Container>
        </Navbar>
      </>
      <MainCarousel />
      <VStack justifyContent="center" alignItems="center">
        <HStack marginBottom="10px"></HStack>

        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {active ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="coral" />
            )}
          </HStack>

          <Tooltip label={account} placement="right">
            <Text>{`Account: ${truncateAddress(account)}`}</Text>
          </Tooltip>
          <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
        </VStack>
        
        <Text>{error ? error.message : null}</Text>
        <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
        <Container>
          <Row>
            <Col>
              <ProductCard />
            </Col>
            <Col>
              <ProductCard />
            </Col>
            <Col>
              <ProductCard />
            </Col>
          </Row>
          <Row>
            <Col>
              <ProductCard />
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard />
            </Col>
          </Row>
        </Container>
      </VStack>
    </>
  );
}
