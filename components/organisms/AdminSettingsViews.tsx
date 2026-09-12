"use client";

import { notificationChannels, walletFields } from "@/assets/data/admin-views";
import { AdminForm } from "@/components/organisms/AdminForm";

export function NotifyMeView() {
  return (
    <section className="zopping-page zopping-settings-page">
      <h1>Notify Me</h1>
      <h2>Notification Channels</h2>
      <div className="zopping-channel-grid">{notificationChannels.map((channel) => <button type="button" key={channel}>{channel}</button>)}</div>
      <h2>When to Send Notifications</h2>
      <div className="zopping-setting-card"><strong>Notification interval</strong><p>Send 2 notifications within an interval of 1 minutes.</p></div>
      <div className="zopping-setting-card"><strong>When stock becomes available</strong><p>Send notification when stock reaches 2 or more units.</p></div>
    </section>
  );
}

export function WalletView() {
  return <AdminForm title="Wallet Configuration" fields={walletFields} />;
}
