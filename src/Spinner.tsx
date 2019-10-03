import styled from 'styled-components';
import { Box } from 'grommet';

export const Spinner = styled(Box)`
  width: 40px;
  height: 40px;
  margin: 40px auto;
  background-color: #2f0dde;
  border-radius: 100%;
  -webkit-animation: pulseScaleOut 1s infinite ease-in-out;
          animation: pulseScaleOut 1s infinite ease-in-out;
@-webkit-keyframes pulseScaleOut {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 0; } }
@keyframes pulseScaleOut {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 0; } }
`;