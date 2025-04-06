import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import http, { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import SubNavigation from '@/components/elements/SubNavigation';
import InstallListener from '@/components/server/InstallListener';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { NavigationLinks, NavigationRouter } from '@/blueprint/extends/routers/ServerRouter';
import BeforeSubNavigation from '@/blueprint/components/Navigation/SubNavigation/BeforeSubNavigation';
import AdditionalServerItems from '@/blueprint/components/Navigation/SubNavigation/AdditionalServerItems';
import AfterSubNavigation from '@/blueprint/components/Navigation/SubNavigation/AfterSubNavigation';
import Logo from '@/assets/images/logo.png';
import Avatar from '@/components/Avatar';
import tw from 'twin.macro';
import { faSignOutAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

export default () => {
    const match = useRouteMatch<{ id: string }>();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const user = useStoreState((state) => state.user.data);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <React.Fragment key={'server-router'}>
            {/* Top Navigation Bar */}
            <NavigationBar />
            {!uuid || !id ? (
                error ? (
                    <ServerError message={error} />
                ) : (
                    <Spinner size={'large'} centered />
                )
            ) : (
                <>
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
                            <BeforeSubNavigation />
                            <div css={tw`flex flex-col flex-grow space-y-2 h-screen overflow-y-auto p-4`}>
                                <NavigationLinks />
                                <AdditionalServerItems />
                                {rootAdmin && (
                                    <a
                                        href={`/admin/servers/view/${serverId}`}
                                        target={'_blank'}
                                        css={tw`p-2 text-neutral-200 hover:text-neutral-100 transition-colors duration-150`}
                                    >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} /> Admin
                                    </a>
                                )}
                            </div>
                            <AfterSubNavigation />

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
                    <div css={tw`flex-1 p-6 overflow-auto ml-[200px]`}>
                        <InstallListener />
                        <TransferListener />
                        <WebsocketHandler />
                        <NavigationRouter />
                    </div>
                </>
            )}
        </React.Fragment>
    );
};
