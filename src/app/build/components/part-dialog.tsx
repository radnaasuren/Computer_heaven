'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { partTypeLabel } from "../lib/part-labels";
import { BuildRow, partSelectOptions } from "../lib/initial-parts";
import { PartsMockData } from "../types/parts";
import { BuilderState } from "../lib/initial-parts";

const PartDialog = ({ rows, data, selection, applyPick }: { 
    rows: BuildRow[],
     data: PartsMockData,
      selection: BuilderState,
       applyPick: (key: keyof PartsMockData["defaults"], id: string) => void }
    ) => {
  const [pickOpen, setPickOpen] = useState(false);
  const [pickKey, setPickKey] = useState<keyof PartsMockData["defaults"] | null>(null);

  const openPicker = (key: keyof PartsMockData["defaults"]) => {
    setPickKey(key);
    setPickOpen(true);
  };

  const closePicker = () => {
    setPickOpen(false);
    setPickKey(null);
  };    

  const applyPickHandler = (key: keyof PartsMockData["defaults"], id: string) => {
    applyPick(key, id);
    closePicker();
  };

  return (
   <Dialog open={pickOpen} onOpenChange={setPickOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Эд анги сонгох</DialogTitle>
          </DialogHeader>

          {pickKey ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Сонгох хэсэг:{" "}
                {partTypeLabel(
                  rows.find((r) => r.defaultKey === pickKey)?.category ?? "cpu",
                )}
              </p>
              <select
                className="h-10 w-full rounded-[10px] border border-[#e4e7ef] bg-[#fafbff] px-3 text-sm text-[#2c2f38] outline-none focus:border-[#2f7df6]"
                value={selection[pickKey] || ""}
                onChange={(e) => applyPickHandler(pickKey, e.target.value)}
              >
                <option value="" disabled>
                  Сонгох...
                </option>
                {(() => {
                  const cat = rows.find((r) => r.defaultKey === pickKey)?.category;
                  if (!cat) return null;
                  return partSelectOptions(cat, data).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ));
                })()}
              </select>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closePicker}>
              Хаах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}

export default PartDialog;