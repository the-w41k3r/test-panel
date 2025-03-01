import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`h-full w-[200px] bg-neutral-800 shadow-lg flex flex-col`}; /* Ensure full height */

    & > div {
        ${tw`flex flex-col items-start w-full space-y-2`}; /* Improved spacing */

        & > a {
            ${tw`w-full py-3 px-4 text-neutral-300 no-underline transition-all duration-150 rounded-lg`};

            &:hover {
                ${tw`text-white bg-neutral-700`};
            }

            &:active,
            &.active {
                ${tw`text-white bg-cyan-600`};
                box-shadow: inset 4px 0 ${theme`colors.cyan.600`.toString()};
            }
        }
    }
`;



export default SubNavigation;
