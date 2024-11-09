import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";

interface KapaTortasVerifyEmailProps {
  verificationCode: string;
  confirmationLink: string;
}

export default function KapaTortasVerifyEmail({
  verificationCode,
  confirmationLink,
}: KapaTortasVerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>KapaTortas Correo de Verificación</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={`https://res.cloudinary.com/dzgjxwvnw/image/upload/v1731093299/kapatortas/rll5qvj7dtgmcbwy6mn2.png`}
                width="100"
                height="60"
                alt="Kapatortas Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>
                Verifica tu dirección de correo electrónico
              </Heading>
              <Text style={mainText}>
                Para acceder a tu cuenta, verifica tu dirección de correo
                electrónico utilizando el siguiente código:
              </Text>
              <Section>
                <Text style={codeText}>{verificationCode}</Text>
                <Text style={validityText}>
                  (Este código es válido por 30 minutos)
                </Text>
              </Section>
              <Section style={buttonSection}>
                <Link href={confirmationLink} style={buttonStyle}>
                  Verificar Correo
                </Link>
              </Section>
            </Section>
            <Hr />
          </Section>
          <Text style={footerText}>
            Este mensaje fue producido por KapaTortas. © 2024. Todos los
            derechos reservados.{" "}
            <Link href="https://kapatortas.com" target="_blank" style={link}>
              KapaTortas
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const KapaTortasVerifyEmailHtml = (props: KapaTortasVerifyEmailProps) =>
  render(<KapaTortasVerifyEmail {...props} />, {
    pretty: true,
  });

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#EF9D49",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#FFF4DD",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };

const buttonSection = {
  marginTop: "20px",
};

const buttonStyle = {
  backgroundColor: "#EF9D49",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};
