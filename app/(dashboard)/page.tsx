"use client";

import useGetAccounts from "../../features/accounts/api/useGetAccounts";

export default function Home() {
    const { data } = useGetAccounts();
    return (
        <div>
            {data?.accounts.map((account) => (
                <div key={account.id}>{account.name}</div>
            ))}
        </div>
    );
}
