import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface VerifyEmailProps {
  name: string;
  callbackURL: string;
}

const baseUrl = process.env.VERCEL_URL || '';

export const VerifyEmail = ({ name, callbackURL }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={{theme: {
        extend: {
          colors: { brand: '#6366f1', second: "#393b89", offwhite: '#fafafa' },
          // spacing: { 0: '0px', 20: '20px', 45: '45px' },
        }}}}
      >
        <Preview>Doubly Welcome</Preview>
        <Body className="bg-white font-sans text-base">
          <Img
            src={`${baseUrl}/logo.svg`}
            width="184"
            height="75"
            alt="Doubly"
            className="mx-auto my-10"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              Welcome to Doubly!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Hi {name}, we’re thrilled to have you on board with Doubly, where every link you share is tracked and optimized for success.
                </Text>

                <Text className="text-base">To get started, please verify your email by clicking the button below:</Text>
              </Row>
            </Section>

            <Section className="text-center mb-10">
              <Button href={callbackURL} className="rounded-lg bg-second px-[18px] py-3 text-white font-medium">
                Verify your email
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

interface ResetPasswordEmailProps {
  name: string;
  callbackURL: string;
}


export const ResetPasswordEmail = ({ name, callbackURL }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={{theme: {
        extend: {
          colors: { brand: '#6366f1', second: "#393b89", offwhite: '#fafafa' },
          // spacing: { 0: '0px', 20: '20px', 45: '45px' },
        }}}}
      >
        <Preview>Doubly Password Reset</Preview>
        <Body className="bg-white font-sans text-base">
          <Img
            src={`${baseUrl}/logo.svg`}
            width="184"
            height="75"
            alt="Doubly"
            className="mx-auto my-5"
          />
          <Container className="bg-white p-45">
            <Section>
              <Row>
                <Text className="text-base">
                  Hi {name},
                </Text>
                <Text className="text-base">
                  Someone recently requested a password change for your Doubly account. If this was you, you can set a new password here:
                </Text>
              </Row>
            </Section>

            <Section className="text-center my-5">
              <Button href={callbackURL} className="rounded-lg bg-second px-[18px] py-3 text-white font-medium">
                Reset your password
              </Button>
            </Section>

            <Section>
              <Row>
                <Text className="text-base">
                  If you don't want to change your password or didn't request this, just ignore and delete this message.
                </Text>
                <Text className="text-base">
                  Happy linking!
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
