import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import http, { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import Avatar from '@/components/Avatar';
import BeforeContent from '@/blueprint/components/Dashboard/Serverlist/BeforeContent';
import AfterContent from '@/blueprint/components/Dashboard/Serverlist/AfterContent';
import Logo from '@/assets/images/logo.png';
import { faSignOutAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import BeforeSubNavigation from '@/blueprint/components/Navigation/SubNavigation/BeforeSubNavigation';
import { NavigationLinks } from '@/blueprint/extends/routers/DashboardRouter';
import AfterSubNavigation from '@/blueprint/components/Navigation/SubNavigation/AfterSubNavigation';
import SubNavigation from '@/components/elements/SubNavigation';
import { CSSTransition } from 'react-transition-group';
import AdditionalServerItems from '@/blueprint/components/Navigation/SubNavigation/AdditionalServerItems';
export default () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const user = useStoreState((state) => state.user.data);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');
    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            {/*<div css={tw`fixed top-0 left-0 w-52 h-screen bg-neutral-900 flex flex-col justify-between`}>*/}
            {/*    /!* Top Section (Search & Links) *!/*/ }
            {/*Sidebar files are in DashboardContainer.tsx/DashboardRouter.tsx/ServerRouter.tsx*/}
            {/*    <div>*/}
            {/*        <div id={'logo'} css={tw`flex-shrink-0 pb-4 pt-4`}>*/}
            {/*            <Link*/}
            {/*                to={'/'}*/}
            {/*                className={*/}
            {/*                    'text-2xl font-header px-4 no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150'*/}
            {/*                }*/}
            {/*            >*/}
            {/*                <img src={Logo} alt="Logo" className="ml-4 h-10 w-auto" />*/}
            {/*            </Link>*/}
            {/*        </div>*/}
            {/*        /!* Search Bar *!/*/}
            {/*        <div css={tw`p-4`}>*/}
            {/*            <div*/}
            {/*                css={tw`relative w-full bg-neutral-700 text-white rounded-lg py-2 pl-10 pr-4 cursor-pointer hover:bg-neutral-600 transition flex items-center`}*/}
            {/*                onClick={() => setSearchVisible(true)}*/}
            {/*            >*/}
            {/*                <div css={tw`absolute left-3 text-neutral-400`}>*/}
            {/*                    <FontAwesomeIcon icon={faSearch} />*/}
            {/*                </div>*/}
            {/*                <span css={tw`text-neutral-400 ml-1`}>Search Server</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}


            {/*        /!* Sidebar Links *!/*/}
            {/*        <div css={tw`p-4 flex flex-col items-start w-full space-y-2 mt-4`}>*/}
            {/*            <a href="/admin" css={tw`w-full py-3 px-4 text-neutral-300 rounded-lg hover:text-white hover:bg-neutral-700`}>*/}
            {/*                Admin*/}
            {/*            </a>*/}
            {/*            <a href="/account" css={tw`w-full py-3 px-4 text-neutral-300 rounded-lg hover:text-white hover:bg-neutral-700`}>*/}
            {/*                Account*/}
            {/*            </a>*/}
            {/*            <button*/}
            {/*                onClick={onTriggerLogout}*/}
            {/*                css={tw`w-full py-3 px-4 text-neutral-300 rounded-lg hover:text-white hover:bg-neutral-700 text-left`}*/}
            {/*            >*/}
            {/*                Logout*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* Bottom Section (User Profile & Links) *!/*/}
            {/*    <div css={tw`p-4 bg-neutral-800 rounded-t-lg`}>*/}
            {/*        /!* User Profile with integrated Logout *!/*/}
            {/*        <div css={tw`flex items-center justify-between mb-4`}>*/}
            {/*            <Link*/}
            {/*                to="/account"*/}
            {/*                css={tw`flex items-center space-x-3 no-underline hover:underline`}*/}
            {/*            >*/}
            {/*                {user && <Avatar.User />}*/}
            {/*                <div>*/}
            {/*                    <p css={tw`text-white text-sm font-semibold hover:text-cyan-400`}>*/}
            {/*                        {user?.username || 'User'}*/}
            {/*                    </p>*/}
            {/*                    <p css={tw`text-neutral-400 text-xs`}>Viewing Servers</p>*/}
            {/*                </div>*/}
            {/*            </Link>*/}
            {/*            <button*/}
            {/*                onClick={onTriggerLogout}*/}
            {/*                css={tw`text-neutral-400 hover:text-white transition-colors duration-150`}*/}
            {/*                title="Logout"*/}
            {/*            >*/}
            {/*                <FontAwesomeIcon icon={faSignOutAlt} />*/}
            {/*            </button>*/}
            {/*        </div>*/}

            {/*        /!* Additional Links *!/*/}
            {/*        <div css={tw`flex flex-col space-y-2 border-t border-neutral-700 pt-3`}>*/}
            {/*            <a*/}
            {/*                href="https://docs.yourpanel.com"*/}
            {/*                target="_blank"*/}
            {/*                rel="noopener noreferrer"*/}
            {/*                css={tw`flex items-center text-neutral-400 hover:text-white transition-colors duration-150 text-sm`}*/}
            {/*            >*/}
            {/*                <FontAwesomeIcon icon={faHeadset} css={tw`mr-2`} />*/}
            {/*                Website Help*/}
            {/*            </a>*/}
            {/*            <a*/}
            {/*                href="https://discord.gg/yourinvite"*/}
            {/*                target="_blank"*/}
            {/*                rel="noopener noreferrer"*/}
            {/*                css={tw`flex items-center text-neutral-400 hover:text-white transition-colors duration-150 text-sm`}*/}
            {/*            >*/}
            {/*                <FontAwesomeIcon icon={faDiscord} css={tw`mr-2`} />*/}
            {/*                Discord Help*/}
            {/*            </a>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</div>*/}

            {/* Sidebar */}
            <CSSTransition timeout={150} classNames={'fade'} appear in>
                <SubNavigation id={'SubNavigation'}>
                    <div id={'logo'} css={tw`flex-shrink-0 pb-4 pt-4`}>
                        <Link
                            to={'/'}
                            css={tw`text-2xl font-header no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150`}
                        >
                            <img src={Logo} alt="Logo" css={tw`m-auto w-auto`} />
                        </Link>
                    </div>
                    <div css={tw`flex flex-col flex-grow space-y-2 h-screen overflow-y-auto p-4`}>

                        {/* Search Bar */}
                        <div css={tw`w-full`}>
                            <div
                                css={tw`relative w-full bg-neutral-700 text-white rounded-lg py-2 pl-10 pr-4 cursor-pointer hover:bg-neutral-600 transition flex items-center`}
                                onClick={() => setSearchVisible(true)}
                            >
                                <div css={tw`absolute left-3 text-neutral-400`}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <span css={tw`text-neutral-400 ml-1`}>Search Server</span>
                            </div>
                        </div>
                        {rootAdmin && (
                            <a
                                href={`/admin`}
                                target={'_blank'}
                                css={tw`p-2 text-neutral-200 hover:text-neutral-100 transition-colors duration-150`}
                            >
                                <FontAwesomeIcon icon={faExternalLinkAlt} /> Admin
                            </a>
                        )}
                    </div>

                    {/* Bottom Section (User Profile & Links) */}
                    <div css={tw`p-4 bg-neutral-800 rounded-t-lg`}>
                        {/* User Profile with integrated Logout */}
                        <div css={tw`flex items-center justify-between mb-4`}>
                            <div css={tw`flex-1 min-w-0`}> {/* Container for avatar+name that takes remaining space */}
                                <Link
                                    to="/account"
                                    css={tw`flex items-center space-x-3 no-underline hover:underline w-full min-w-0`}
                                >
                                    {user && <Avatar.User />}
                                    <div css={tw`min-w-0 overflow-hidden`}> {/* Prevents text overflow */}
                                        <p css={tw`text-white text-sm font-semibold hover:text-cyan-400 truncate`}>
                                            {user?.username || 'User'}
                                        </p>
                                        <p css={tw`text-neutral-400 text-xs truncate`}>Account Settings</p>
                                    </div>
                                </Link>
                            </div>
                            <button
                                onClick={onTriggerLogout}
                                css={tw`text-neutral-400 hover:text-white transition-colors duration-150 flex-shrink-0 ml-4`}
                                title="Logout"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </button>
                        </div>

                        {/* Additional Links */}
                        <div css={tw`flex flex-col space-y-2 border-t border-neutral-700 pt-3`}>
                            <a
                                href="https://billing.humbleservers.com/contact.php"
                                target="_blank"
                                rel="noopener noreferrer"
                                css={tw`flex items-center text-neutral-400 hover:text-white transition-colors duration-150 text-sm`}
                            >
                                <FontAwesomeIcon icon={faHeadset} css={tw`mr-2`} />
                                Website Help
                            </a>
                            <a
                                href="https://discord.humbleservers.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                css={tw`flex items-center text-neutral-400 hover:text-white transition-colors duration-150 text-sm`}
                            >
                                <FontAwesomeIcon icon={faDiscord} css={tw`mr-2`} />
                                Discord Help
                            </a>
                        </div>
                    </div>

                </SubNavigation>
            </CSSTransition>

            {/* Main Content */}
            <div css={tw`ml-52 flex-1 p-6`}>
                <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
                    <BeforeContent />
                    {rootAdmin && (
                        <div css={tw`mb-2 flex justify-end items-center pt-5 pb-3`}>
                            <p css={tw`uppercase text-xs text-neutral-400 mr-2`}>
                                {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                            </p>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </div>
                    )}
                    {!servers ? (
                        <Spinner centered size={'large'} />
                    ) : (
                        <Pagination data={servers} onPageSelect={setPage}>
                            {({ items }) =>
                                items.length > 0 ? (
                                    <div css={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4`}>
                                        {items.map((server) => (
                                            <ServerRow key={server.uuid} server={server} />
                                        ))}
                                    </div>
                                ) : (
                                    <p css={tw`text-center text-sm text-neutral-400`}>
                                        {showOnlyAdmin
                                            ? 'There are no other servers to display.'
                                            : 'There are no servers associated with your account.'}
                                    </p>
                                )
                            }
                        </Pagination>
                    )}
                    <AfterContent />
                </PageContentBlock>
            </div>



            {/* Search Modal */}
            {searchVisible && <SearchContainer visible={searchVisible} onClose={() => setSearchVisible(false)} />}
        </div>
    );
};
