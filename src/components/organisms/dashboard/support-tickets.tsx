"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Support } from "@/libs/types/support.type";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function SupportPage() {
  const [supports, setSupports] = useState<Support[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupport, setSelectedSupport] = useState<Support | null>(null);
  const t = useTranslations();

  useEffect(() => {
    async function fetchSupports() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/supports`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          },
        );
        const data = await res.json();
        setSupports(data.data);
      } catch (error) {}
    }

    fetchSupports();
  }, []);

  const filtered = supports?.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.subject.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Common.support-messages")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder={t("Common.search-by-name-email-or-subject")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t("Common.name")}</TableHead>
                  <TableHead>{t("Common.email")}</TableHead>
                  <TableHead>{t("Common.subject")}</TableHead>
                  <TableHead>{t("Common.message")}</TableHead>
                  <TableHead>{t("Common.created-at")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filtered || []).map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedSupport(item)}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.message}
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedSupport}
        onOpenChange={() => setSelectedSupport(null)}
      >
        <DialogContent className="animate-in fade-in zoom-in max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-6 shadow-2xl duration-200">
          {selectedSupport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary text-xl font-bold">
                  {selectedSupport.subject}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">{t("Common.name")}:</span>{" "}
                  {selectedSupport.name}
                </div>
                <div>
                  <span className="font-medium">{t("Common.email")}:</span>{" "}
                  {selectedSupport.email}
                </div>
                <div>
                  <span className="font-medium">{t("Common.created-at")}:</span>{" "}
                  {new Date(selectedSupport.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">{t("Common.message")}:</span>
                  <div className="mt-2 max-h-[40vh] overflow-y-auto rounded bg-gray-100 p-4 text-sm whitespace-pre-line">
                    {selectedSupport.message}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
