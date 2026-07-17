import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Img,
} from "@react-email/components";

interface OTPEmailProps {
  otp: string;
}

export const OTPEmail = ({ otp }: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://toursbu.com/logo.png" // We will replace with real logo later
            width="150"
            height="40"
            alt="ToursBU"
            style={logo}
          />
          <Text style={heading}>Your verification code</Text>
          <Text style={text}>
            Please use the following code to sign in to ToursBU. It is valid for 5 minutes.
          </Text>
          <Section style={codeBox}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#525f7f",
  padding: "0 24px",
};

const codeBox = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 24px",
  padding: "12px",
};

const code = {
  fontSize: "32px",
  fontWeight: "600",
  textAlign: "center" as const,
  letterSpacing: "8px",
  color: "#000",
  margin: "0",
};

const footer = {
  fontSize: "14px",
  color: "#b0b0b0",
  padding: "0 24px",
  marginTop: "24px",
};

export default OTPEmail;
