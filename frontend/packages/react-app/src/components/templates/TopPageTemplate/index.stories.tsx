import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import TopPageTemplate from ".";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "Templates/TopPageTemplate",
  component: TopPageTemplate,
} as Meta;

const Template: Story = () => (
  <BrowserRouter>
    <TopPageTemplate />
  </BrowserRouter>
);

export const Default = Template.bind({});
