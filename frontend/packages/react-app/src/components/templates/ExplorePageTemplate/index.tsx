import React from "react";
import { Box, Flex, Modal, Button, Card, Heading, Text, Link } from "rimble-ui";
import AppHeader from "../../molecules/AppHeader";
import TokenList from "../../organisms/TokenList";
import { Web3Props } from "../../../interfaces";
import { ExplorePageState } from "../../pages/ExplorePage";

export interface ExportPageTemplateProps extends Web3Props {
  readonly loading: boolean;
  readonly state: ExplorePageState;
  dispatch({}: object): void;
}

const ExplorePageTemplate = ({
  provider,
  loadWeb3Modal,
  loading,
  state,
  dispatch,
}: ExportPageTemplateProps) => (
  <div>
    <AppHeader provider={provider} loadWeb3Modal={loadWeb3Modal} />
    <Box m={"auto"} my={5} width={[9 / 10, 3 / 4]}>
      <TokenList tokens={state.tokens} loading={loading} />

      {/* TODO: Use Organisms and molecules */}
      <Box mt={4}>
        <Link
          my={"auto"}
          fontSize="3"
          onClick={() => dispatch({ type: "open_modal" })}
        >
          + Add new token
        </Link>

        {/* Tentative implementation */}
        <Modal isOpen={state.isOpen}>
          <Card width={"420px"} p={0}>
            <Button.Text
              icononly
              icon={"Close"}
              color={"moon-gray"}
              position={"absolute"}
              top={0}
              right={0}
              mt={3}
              mr={3}
              onClick={() => dispatch({ type: "close_modal" })}
            />

            <Box p={4} mb={3}>
              <Heading.h3>Contract Address</Heading.h3>
              <Text>Set your token address</Text>
            </Box>

            <Flex
              px={4}
              py={3}
              borderTop={1}
              borderColor={"#E8E8E8"}
              justifyContent={"flex-end"}
            >
              <Button.Outline onClick={() => dispatch({ type: "close_modal" })}>
                Cancel
              </Button.Outline>
              <Button ml={3}>Add</Button>
            </Flex>
          </Card>
        </Modal>
      </Box>
    </Box>
  </div>
);

export default ExplorePageTemplate;
