import { RuleEditorModal } from "@/components/features";
import { ScreenLayout } from "@/components/layout";
import { EmptyState, SlideIn, SwipeableCard } from "@/components/ui";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { RecommendationRule, SavedJourney, useJourneysStore } from "@/stores";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Plus,
  Route,
  Trash2,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function RuleBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Icon size={12} color={theme.text.muted} />
      <Text className="text-text-muted text-xs ml-1">{label}</Text>
    </View>
  );
}

function RuleItem({
  rule,
  onEdit,
  onDelete,
}: {
  rule: RecommendationRule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const parts: string[] = [];

  if (rule.location) {
    parts.push(`📍 ${rule.location.name} (${rule.location.radiusMeters}m)`);
  }
  if (rule.timeStart && rule.timeEnd) {
    parts.push(`🕐 ${rule.timeStart} - ${rule.timeEnd}`);
  }
  if (
    rule.daysOfWeek &&
    rule.daysOfWeek.length > 0 &&
    rule.daysOfWeek.length < 7
  ) {
    const dayNames = rule.daysOfWeek.map((d) => DAYS_SHORT[d]).join(", ");
    parts.push(`📅 ${dayNames}`);
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <Pressable onPress={onEdit} style={{ flex: 1 }}>
        <Text className="text-text text-sm">
          {parts.join("  •  ") || "Empty rule"}
        </Text>
      </Pressable>
      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: `${theme.error}20`,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
      >
        <Trash2 size={14} color={theme.error} />
      </Pressable>
    </View>
  );
}

function JourneyCard({
  journey,
  expanded,
  onDelete,
  onToggleExpand,
  onAddRule,
  onEditRule,
  onDeleteRule,
}: {
  journey: SavedJourney;
  expanded: boolean;
  onDelete: () => void;
  onToggleExpand: () => void;
  onAddRule: () => void;
  onEditRule: (rule: RecommendationRule) => void;
  onDeleteRule: (ruleId: string) => void;
}) {
  const hasLocationRule = journey.rules.some((r) => r.location);
  const hasTimeRule = journey.rules.some((r) => r.timeStart && r.timeEnd);
  const hasDaysRule = journey.rules.some(
    (r) => r.daysOfWeek && r.daysOfWeek.length > 0 && r.daysOfWeek.length < 7
  );

  return (
    <View style={{ marginBottom: 12 }}>
      <SwipeableCard
        onDelete={onDelete}
        onPress={onToggleExpand}
        deleteAlertTitle="Delete Journey"
        deleteAlertMessage={`Delete ${journey.fromStation.name} → ${journey.toStation.name}?`}
      >
        {/* Journey Route */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            paddingRight: 40,
          }}
        >
          <View style={{ flex: 1, paddingRight: 4 }}>
            <Text
              className="text-text text-base font-semibold"
              numberOfLines={1}
            >
              {journey.fromStation.name}
            </Text>
            <Text className="text-text-muted text-xs">
              {journey.fromStation.crs}
            </Text>
          </View>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: `${theme.primary.DEFAULT}20`,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 8,
              flexShrink: 0,
            }}
          >
            <ArrowRight size={16} color={theme.primary.DEFAULT} />
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", paddingLeft: 4 }}>
            <Text
              className="text-text text-base font-semibold"
              numberOfLines={1}
            >
              {journey.toStation.name}
            </Text>
            <Text className="text-text-muted text-xs">
              {journey.toStation.crs}
            </Text>
          </View>
        </View>

        {/* Rule Indicators */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 40,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
            {journey.rules.length > 0 ? (
              <>
                {hasLocationRule && (
                  <RuleBadge icon={MapPin} label="Location" />
                )}
                {hasTimeRule && <RuleBadge icon={Clock} label="Time" />}
                {hasDaysRule && <RuleBadge icon={Calendar} label="Days" />}
                <View
                  style={{
                    backgroundColor: `${theme.primary.DEFAULT}20`,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text className="text-primary text-xs font-medium">
                    {journey.rules.length} rule
                    {journey.rules.length !== 1 ? "s" : ""}
                  </Text>
                </View>
              </>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(255,200,0,0.1)",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#F5A623", fontSize: 12 }}>
                  Tap to add rules
                </Text>
              </View>
            )}
          </View>
          {expanded ? (
            <ChevronUp size={20} color={theme.text.muted} />
          ) : (
            <ChevronDown size={20} color={theme.text.muted} />
          )}
        </View>

        {/* Expanded Rules Section - Inside the card */}
        {expanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            layout={Layout.duration(200)}
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.08)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text className="text-text-secondary text-sm font-medium">
                Recommendation Rules
              </Text>
              <Pressable
                onPress={onAddRule}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: `${theme.primary.DEFAULT}20`,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Plus size={14} color={theme.primary.DEFAULT} />
                <Text className="text-primary text-xs font-medium ml-1">
                  Add
                </Text>
              </Pressable>
            </View>

            {journey.rules.length > 0 ? (
              journey.rules.map((rule) => (
                <RuleItem
                  key={rule.id}
                  rule={rule}
                  onEdit={() => onEditRule(rule)}
                  onDelete={() => onDeleteRule(rule.id)}
                />
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Text className="text-text-muted text-sm text-center">
                  No rules yet. Add a rule to get{"\n"}smart recommendations.
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </SwipeableCard>
    </View>
  );
}

export default function MyJourneysScreen() {
  const { journeys, removeJourney, removeRule } = useJourneysStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<RecommendationRule | null>(
    null
  );

  const handleToggleExpand = useCallback((journeyId: string) => {
    haptics.selection();
    setExpandedId((prev) => (prev === journeyId ? null : journeyId));
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      removeJourney(id);
      if (expandedId === id) {
        setExpandedId(null);
      }
    },
    [removeJourney, expandedId]
  );

  const handleAddRule = useCallback((journeyId: string) => {
    haptics.selection();
    setEditingJourneyId(journeyId);
    setEditingRule(null);
    setRuleModalVisible(true);
  }, []);

  const handleEditRule = useCallback(
    (journeyId: string, rule: RecommendationRule) => {
      haptics.selection();
      setEditingJourneyId(journeyId);
      setEditingRule(rule);
      setRuleModalVisible(true);
    },
    []
  );

  const handleDeleteRule = useCallback(
    (journeyId: string, ruleId: string) => {
      haptics.selection();
      removeRule(journeyId, ruleId);
    },
    [removeRule]
  );

  const handleCloseRuleModal = useCallback(() => {
    setRuleModalVisible(false);
    setEditingJourneyId(null);
    setEditingRule(null);
  }, []);

  return (
    <ScreenLayout
      title="My Journeys"
      subtitle="Smart Routes"
      icon={Route}
      iconBgClass="bg-primary/20"
      iconColor={theme.primary.DEFAULT}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {journeys.length > 0 ? (
          <SlideIn direction="bottom" delay={100}>
            <View>
              {journeys.map((journey) => (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  expanded={expandedId === journey.id}
                  onDelete={() => handleDelete(journey.id)}
                  onToggleExpand={() => handleToggleExpand(journey.id)}
                  onAddRule={() => handleAddRule(journey.id)}
                  onEditRule={(rule) => handleEditRule(journey.id, rule)}
                  onDeleteRule={(ruleId) =>
                    handleDeleteRule(journey.id, ruleId)
                  }
                />
              ))}
            </View>
          </SlideIn>
        ) : (
          <SlideIn direction="bottom" delay={100}>
            <View className="mt-8">
              <EmptyState
                icon={Route}
                title="No saved journeys"
                description="Search for trains on the Home screen, then save your journey to get smart recommendations based on your location and time."
              />
            </View>
          </SlideIn>
        )}

        {/* Tip for adding journeys */}
        {journeys.length === 0 && (
          <SlideIn direction="bottom" delay={200}>
            <View
              style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Plus size={16} color={theme.primary.DEFAULT} />
                <Text className="text-primary text-sm font-semibold ml-2">
                  How to add a journey
                </Text>
              </View>
              <Text className="text-text-muted text-sm leading-5">
                1. Go to the Home tab{"\n"}
                2. Search for your train{"\n"}
                3. Tap the heart icon to save{"\n"}
                4. Come back here to set up rules
              </Text>
            </View>
          </SlideIn>
        )}
      </ScrollView>

      {/* Rule Editor Modal */}
      {editingJourneyId && (
        <RuleEditorModal
          visible={ruleModalVisible}
          onClose={handleCloseRuleModal}
          journeyId={editingJourneyId}
          editingRule={editingRule}
        />
      )}
    </ScreenLayout>
  );
}
