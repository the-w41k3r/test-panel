import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`fixed top-0 left-0 h-screen w-52 bg-neutral-900 flex flex-col justify-between z-40`};

    /* Search bar */
    .search-bar {
        ${tw`relative w-full bg-neutral-700 text-white rounded-lg py-2 pl-10 pr-4 cursor-pointer hover:bg-neutral-600 transition flex items-center mb-4`};

        .search-icon {
            ${tw`absolute left-3 text-neutral-400`};
        }

        span {
            ${tw`text-neutral-400 ml-1`};
        }
    }

    /* Navigation links container */
    .nav-links {
        ${tw`flex flex-col items-start w-full space-y-2`};
    }

    /* Navigation links */
    & > div {
        ${tw`flex flex-col items-start w-full`};

        /* Regular links */
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

        /* Logout button */
        & > button {
            ${tw`w-full py-3 px-4 text-neutral-300 rounded-lg hover:text-white hover:bg-neutral-700 text-left bg-transparent border-none cursor-pointer`};
        }
    }
`;

export default SubNavigation;
