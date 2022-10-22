import styled from '@emotion/styled';
import { RefreshOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { TFunction } from 'react-i18next';

const Container = styled.div<{ background: string; color: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  max-height: 100%;

  background: ${({ background }) => background ?? '#222'};
  color: ${({ color }) => color ?? '#fff'};
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  code {
    color: #f32d2d;
    padding: 1.5rem;
    font-size: 0.8rem;
    background: #00000085;
    margin-top: auto;
  }
`;

interface ExternalAppBoundaryProps {
  color: string;
  background: string;
  t: TFunction;
}

export class ExternalAppBoundary extends React.Component<ExternalAppBoundaryProps> {
  state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container background={this.props.background} color={this.props.color}>
          <Stack alignItems="center" spacing={2} marginTop="15%" textAlign="center">
            <Box p={4}>
              <Typography variant="h5">{this.props.t('MISC.APP_CRASHED_TITLE')}</Typography>
              <Typography variant="caption">{this.props.t('MISC.APP_CRASHED_MSG')}</Typography>
            </Box>

            <Button
              color="inherit"
              fullWidth
              onClick={() => this.setState({ hasError: false })}
              startIcon={<RefreshOutlined />}
            >
              {this.props.t('MISC.APP_CRASHED_ACTION')}
            </Button>
          </Stack>

          <code>{this.state.errorMsg}</code>
        </Container>
      );
    }

    return this.props.children;
  }
}
