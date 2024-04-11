import { Button, Flex, Heading, withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import './Header.css'

const Header = ({ signOut }) => {
  return (
    <header className='main-header'>
      <Flex justifyContent={"space-between"}>
        <Heading color={"white"} level={3}>Event Manager</Heading>
        <Button variation="primary" colorTheme="warning" height={40} onClick={signOut}>Sign Out</Button>
      </Flex>
    </header>
  )
}

export default withAuthenticator(Header);