import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { PeriodType } from "@/types/period";
import {
  PERIOD_TABS,
  formatPeriod,
  getRecentPeriods,
  shiftPeriod,
} from "@/utils/period";

/**
 * Weekly / Monthly / Yearly tabs + prev/next arrows.
 * Tap the label to jump to a recent period.
 * UI only — no tracker data wired yet.
 */
export function ProfilePeriodSelector() {
  const [period, setPeriod] = useState<PeriodType>("weekly");
  const [anchor, setAnchor] = useState(() => new Date());
  const [pickerOpen, setPickerOpen] = useState(false);

  const label = formatPeriod(anchor, period);
  // No future data to show, so the "next" arrow stops at the current period.
  const isLatest = label === formatPeriod(new Date(), period);

  function selectPeriod(date: Date) {
    setAnchor(date);
    setPickerOpen(false);
  }

  return (
    <View className="px-4 pb-2 pt-5">
      {/* Tabs */}
      <View className="mb-3.5 flex-row rounded-xl bg-[#F3F4EC] p-1">
        {PERIOD_TABS.map(({ key, label: tabLabel }) => {
          const active = period === key;
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => setPeriod(key)}
              className={`flex-1 items-center rounded-lg py-2 ${active ? "bg-[#2D6A4F]" : ""}`}
            >
              <Text
                className={`font-poppins-semibold text-[13px] ${active ? "text-white" : "text-[#6B6B6B]"}`}
              >
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Navigator */}
      <View className="flex-row items-center rounded-xl bg-[#F3F4EC] px-3 py-2.5">
        <TouchableOpacity
          activeOpacity={0.7}
          className="p-1"
          onPress={() => setAnchor(shiftPeriod(anchor, period, -1))}
        >
          <Text className="font-poppins-semibold text-[22px] leading-[26px] text-[#1A3C34]">‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 items-center"
          onPress={() => setPickerOpen(true)}
        >
          <Text numberOfLines={1} className="font-poppins-semibold text-[13px] text-[#1A3C34]">
            {label}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isLatest}
          className={`p-1 ${isLatest ? "opacity-30" : ""}`}
          onPress={() => setAnchor(shiftPeriod(anchor, period, 1))}
        >
          <Text className="font-poppins-semibold text-[22px] leading-[26px] text-[#1A3C34]">›</Text>
        </TouchableOpacity>
      </View>

      {/* Picker */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable className="flex-1 bg-black/40" onPress={() => setPickerOpen(false)} />

        <View className="max-h-[65%] overflow-hidden rounded-t-3xl bg-white pb-9">
          <View className="mb-1.5 mt-2.5 h-1 w-10 self-center rounded-full bg-gray-300" />

          <View className="flex-row items-center justify-between px-5 pb-3.5">
            <Text className="font-poppins-bold text-[17px] text-[#1A1A1A]">Select period</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setPickerOpen(false)}>
              <Text className="px-1 text-lg text-[#6B6B6B]">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {getRecentPeriods(period).map((date) => {
              const text = formatPeriod(date, period);
              const selected = text === label;
              return (
                <TouchableOpacity
                  key={text}
                  activeOpacity={0.75}
                  onPress={() => selectPeriod(date)}
                  className={`mx-3 my-0.5 flex-row items-center justify-between rounded-[10px] px-5 py-3 ${selected ? "bg-[#D8F3DC]" : ""}`}
                >
                  <Text
                    className={`font-poppins-semibold text-sm ${selected ? "text-[#2D6A4F]" : "text-[#1A1A1A]"}`}
                  >
                    {text}
                  </Text>
                  {selected && <Text className="font-poppins-bold text-base text-[#2D6A4F]">✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
