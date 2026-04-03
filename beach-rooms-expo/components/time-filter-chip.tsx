import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatTimeDisplay } from '@/lib/time-utils';

interface TimeFilterChipProps {
  selectedTime: Date | null;
  onPress: () => void;
  onClear: () => void;
}

export function TimeFilterChip({ selectedTime, onPress, onClear }: TimeFilterChipProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const isFiltered = selectedTime !== null;
  const displayText = isFiltered ? formatTimeDisplay(selectedTime) : 'Now';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.chip,
          { borderColor: isFiltered ? tintColor : iconColor },
          isFiltered && { backgroundColor: `${tintColor}15` },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="time-outline"
          size={16}
          color={isFiltered ? tintColor : iconColor}
        />
        <ThemedText
          style={[
            styles.chipText,
            { color: isFiltered ? tintColor : textColor },
          ]}
        >
          {displayText}
        </ThemedText>
        {isFiltered && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onClear();
            }}
            hitSlop={8}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={tintColor} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 12,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: 2,
  },
});
