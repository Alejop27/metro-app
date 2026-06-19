import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  FlatList,
  Text,
} from 'react-native';
import { Search, MapPin } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suggestions?: { id: string; name: string }[];
  onSelectSuggestion?: (id: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search bus or route',
  suggestions = [],
  onSelectSuggestion,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: false }),
    ]).start();
  };

  const handleBlur = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.container}>
        <Search size={20} color="#454652" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(69,70,82,0.5)"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      {suggestions.length > 0 && value.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 200 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  index === suggestions.length - 1 && styles.suggestionItemLast,
                ]}
                onPress={() => onSelectSuggestion?.(item.id)}
              >
                <MapPin size={16} color="#0056c5" />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 72,
    left: '5%',
    right: '5%',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(198,197,212,0.3)',
    paddingHorizontal: 24,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#191c1e',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineWidth: 0,
  } as any,
  suggestionsWrapper: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(198,197,212,0.3)',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
});

export default SearchBar;
