import { Container, Flex, Button, Box, useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import Web3 from "web3";
import CHAINS from "@/constants/chains.json";
import MetamaskIcon from "@/assets/svg/metamask.svg";
import DisconnectIcon from "@/assets/svg/disconnect.svg";
import Image from "next/image";

const Home: NextPage = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balanceOf, setBalanceOf] = useState("0");
  const [symbol, setSymbol] = useState("");

  const toast = useToast();

  const handleConnect = async () => {
    if (window["ethereum"]) {
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      const chainId = await web3.eth.getChainId();
      const chain = CHAINS.find((x) => x.chainId == chainId);
      setSymbol(chain?.nativeCurrency.symbol || "");
      const balance = await web3.eth.getBalance(accounts[0]);
      setBalanceOf(web3.utils.fromWei(balance, "ether"));
      toast({
        title: "Connected Wallet",
        description: `${chain?.name}`,
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
      setConnected(true);
    } else {
      toast({
        title: "Please install Metamask extension",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleDisconnect = () => {
    setAccount("");
    setBalanceOf("0");
    setSymbol("");
    setConnected(false);
    toast({
      title: "Disconnected Wallet",
      status: "error",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Flex w="100%" h="100vh" alignItems="center" justifyContent="center">
      <Container
        w="400px"
        h="300px"
        rounded="xl"
        boxShadow="dark-lg"
        p="16px"
        bg="#2C3333"
        color="white"
      >
        <Box ml="auto" w="max-content">
          <Button
            colorScheme={connected ? "gray" : "teal"}
            color={connected ? "blackAlpha.800" : "white"}
            onClick={() => {
              if (connected) {
                handleDisconnect();
              } else {
                handleConnect();
              }
            }}
            // eslint-disable-next-line jsx-a11y/alt-text
            leftIcon={
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image
                src={connected ? DisconnectIcon : MetamaskIcon}
                width={20}
              />
            }
          >
            {connected ? "Disconnect Metamask" : "Connect to Metamask"}
          </Button>
        </Box>
        <Box fontSize={32} textAlign="center" mt="12px">
          Balance: {balanceOf} {symbol}
        </Box>
        <Box fontSize={14} textAlign="center">
          Address: {account}
        </Box>
      </Container>
    </Flex>
  );
};

export default Home;
