import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BrowserRouter } from "react-router-dom";
import TopPageTemplate from "./index";

export default {
  title: "Templates/TopPageTemplate",
  component: TopPageTemplate,
} as Meta;

const Template: Story = (args) => (
  <BrowserRouter>
    <TopPageTemplate {...args} />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {};
