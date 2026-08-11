"use client";

import React from "react";
import { PageLayout } from "@/components/PageLayout";
import { AdminPanel } from "@/components/Admin/AdminPanel";

export default function AdminPageRoute() {
  return (
    <PageLayout activeSection="admin">
      <AdminPanel />
    </PageLayout>
  );
}
