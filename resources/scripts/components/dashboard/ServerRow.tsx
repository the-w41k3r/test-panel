import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

import BeforeEntryName from '@/blueprint/components/Dashboard/Serverlist/ServerRow/BeforeEntryName';
import AfterEntryName from '@/blueprint/components/Dashboard/Serverlist/ServerRow/AfterEntryName';
import BeforeEntryDescription from '@/blueprint/components/Dashboard/Serverlist/ServerRow/BeforeEntryDescription';
import AfterEntryDescription from '@/blueprint/components/Dashboard/Serverlist/ServerRow/AfterEntryDescription';
import ResourceLimits from '@/blueprint/components/Dashboard/Serverlist/ServerRow/ResourceLimits';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-500`)};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-400`)};
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`grid grid-cols-12 gap-4 relative`};

    & .status-bar {
        ${tw`w-2 bg-red-500 absolute right-0 z-20 rounded-full m-1 opacity-50 transition-all duration-150`};
        height: calc(100% - 0.5rem);

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500`
                : tw`bg-yellow-500`};
    }

    &:hover .status-bar {
        ${tw`opacity-75`};
    }
`;


type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);
    const isInstalling = server.status?.includes('install');
    const isTransferring = server.status?.includes('transfer');


    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;
        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? Math.ceil(server.limits.cpu / 100) * 100 + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div css={tw`col-span-10 sm:col-span-5 flex flex-col`}> 
                <p css={tw`text-2xl font-semibold break-words`}>{server.name}</p>
                <p css={tw`text-base text-neutral-400`}>{server.allocations.filter((alloc) => alloc.isDefault).map((allocation) => (
                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                        {allocation.alias || ip(allocation.ip)}:{allocation.port}
                    </React.Fragment>
                ))}</p>
                <p css={tw`text-base text-neutral-500`}>ID: {server.id}</p>
            </div>
            <div css={tw`col-span-7 sm:col-span-7 flex flex-col items-end gap-2`}>
            {isSuspended || (server.status as string) === 'installing' || (server.status as string) === 'transferring' ? (
                    // Display status message when the server is in a special state
                    <div css={tw`w-full flex justify-center`}>
                        <span
                            css={[
                                tw`px-4 py-2 text-base font-bold rounded`,
                                isSuspended
                                    ? tw`bg-red-500 text-white`
                                    : isInstalling
                                    ? tw`bg-yellow-500 text-white`
                                    : isTransferring
                                    ? tw`bg-blue-500 text-white`
                                    : tw`hidden`,
                            ]}
                        >
                            {isSuspended
                                ? 'Suspended'
                                : isInstalling
                                ? 'Installing'
                                : isTransferring
                                ? 'Transferring'
                                : ''}
                        </span>
                    </div>

                ) : (
                    // Display CPU, RAM, and Disk usage if the server is active
                    <>
                        {/* CPU Usage */}
                        <div css={tw`grid grid-cols-7 w-full items-center gap-2`}>
                            <p css={tw`text-right text-sm font-bold col-span-2 flex justify-end items-center gap-1`}>
                                <Icon icon={faMicrochip} $alarm={alarms.cpu} /> CPU:
                            </p>
                            <div css={tw`relative col-span-5 bg-gray-700 rounded h-4`}>
                                <div css={tw`bg-green-500 h-4 rounded`} style={{ width: `${stats?.cpuUsagePercent ?? 0}%` }}></div>
                                <p css={tw`absolute w-full text-right text-xs font-bold top-0 left-0 h-4 flex items-center justify-end pr-2`}>
                                    {stats?.cpuUsagePercent.toFixed(2) ?? '--'}% / {cpuLimit ?? '--'}
                                </p>
                            </div>
                        </div>

                        {/* RAM Usage */}
                        <div css={tw`grid grid-cols-7 w-full items-center gap-2`}>
                            <p css={tw`text-right text-sm font-bold col-span-2 flex justify-end items-center gap-1`}>
                                <Icon icon={faMemory} $alarm={alarms.memory} /> RAM:
                            </p>
                            <div css={tw`relative col-span-5 bg-gray-700 rounded h-4`}>
                                <div css={tw`bg-red-500 h-4 rounded`} 
                                style={{ width: `${(stats?.memoryUsageInBytes ?? 0) / mbToBytes(server.limits.memory ?? 1) * 100}%` }}>
                                </div>
                                <p css={tw`absolute w-full text-right text-xs font-bold top-0 left-0 h-4 flex items-center justify-end pr-2`}>
                                    {bytesToString(stats?.memoryUsageInBytes ?? 0)} / {memoryLimit ?? '--'}
                                </p>
                            </div>
                        </div>

                        {/* Disk Usage */}
                        <div css={tw`grid grid-cols-7 w-full items-center gap-2`}>
                            <p css={tw`text-right text-sm font-bold col-span-2 flex justify-end items-center gap-1`}>
                                <Icon icon={faHdd} $alarm={alarms.disk} /> Disk:
                            </p>
                            <div css={tw`relative col-span-5 bg-gray-700 rounded h-4`}>
                                <div css={tw`bg-blue-500 h-4 rounded`} 
                                style={{ width: `${(stats?.diskUsageInBytes ?? 0) / mbToBytes(server.limits.disk ?? 1) * 100}%` }}>
                                </div>
                                <p css={tw`absolute w-full text-right text-xs font-bold top-0 left-0 h-4 flex items-center justify-end pr-2`}>
                                    {bytesToString(stats?.diskUsageInBytes ?? 0)} / {diskLimit ?? '--'}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className={'status-bar'} />
        </StatusIndicatorBox>
    );
};