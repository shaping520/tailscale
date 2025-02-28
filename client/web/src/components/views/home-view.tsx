// Copyright (c) Tailscale Inc & AUTHORS
// SPDX-License-Identifier: BSD-3-Clause

import cx from "classnames"
import React from "react"
import { ReactComponent as ArrowRight } from "src/assets/icons/arrow-right.svg"
import { ReactComponent as ConnectedDeviceIcon } from "src/assets/icons/connected-device.svg"
import ExitNodeSelector from "src/components/exit-node-selector"
import { NodeData, NodeUpdaters } from "src/hooks/node-data"
import { Link } from "wouter"

export default function HomeView({
  readonly,
  node,
  nodeUpdaters,
}: {
  readonly: boolean
  node: NodeData
  nodeUpdaters: NodeUpdaters
}) {
  return (
    <div className="mb-12 w-full">
      <h2 className="mb-3">This device</h2>
      <div className="-mx-5 card mb-9">
        <div className="flex justify-between items-center text-lg mb-5">
          <div className="flex items-center">
            <ConnectedDeviceIcon />
            <div className="ml-3">
              <h1>{node.DeviceName}</h1>
              {/* TODO(sonia): display actual status */}
              <p className="text-gray-500 text-sm">Connected</p>
            </div>
          </div>
          <p className="text-gray-800 text-lg leading-[25.20px]">{node.IP}</p>
        </div>
        {(node.Features["advertise-exit-node"] ||
          node.Features["use-exit-node"]) && (
          <ExitNodeSelector
            className="mb-5"
            node={node}
            nodeUpdaters={nodeUpdaters}
            disabled={readonly}
          />
        )}
        <Link className="text-blue-500 font-medium leading-snug" to="/details">
          View device details &rarr;
        </Link>
      </div>
      <h2 className="mb-3">Settings</h2>
      {node.Features["advertise-routes"] && (
        <SettingsCard
          link="/subnets"
          className="mb-3"
          title="Subnet router"
          body="Add devices to your tailnet without installing Tailscale on them."
        />
      )}
      {node.Features["ssh"] && (
        <SettingsCard
          link="/ssh"
          className="mb-3"
          title="Tailscale SSH server"
          body="Run a Tailscale SSH server on this device and allow other devices in your tailnet to SSH into it."
          badge={
            node.RunningSSHServer
              ? {
                  text: "Running",
                  icon: <div className="w-2 h-2 bg-emerald-500 rounded-full" />,
                }
              : undefined
          }
        />
      )}
      {/* TODO(sonia,will): hiding unimplemented settings pages until implemented */}
      {/* <SettingsCard
        link="/serve"
        title="Share local content"
        body="Share local ports, services, and content to your Tailscale network or to the broader internet."
      /> */}
    </div>
  )
}

function SettingsCard({
  title,
  link,
  body,
  badge,
  className,
}: {
  title: string
  link: string
  body: string
  badge?: {
    text: string
    icon?: JSX.Element
  }
  className?: string
}) {
  return (
    <Link
      to={link}
      className={cx(
        "-mx-5 card flex justify-between items-center cursor-pointer",
        className
      )}
    >
      <div>
        <div className="flex gap-2">
          <p className="text-gray-800 font-medium leading-tight mb-2">
            {title}
          </p>
          {badge && (
            <div className="h-5 px-2 bg-stone-100 rounded-full flex items-center gap-2">
              {badge.icon}
              <div className="text-gray-500 text-xs font-medium">
                {badge.text}
              </div>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm leading-tight">{body}</p>
      </div>
      <div>
        <ArrowRight className="ml-3" />
      </div>
    </Link>
  )
}
