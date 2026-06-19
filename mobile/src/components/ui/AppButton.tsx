import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const getStyles = () => {
    let btnStyle: any = [styles.base];
    let textStyle: any = [styles.baseText];

    // Variant styles
    if (variant === 'primary') {
      btnStyle.push(styles.primaryBtn);
      textStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      btnStyle.push(styles.secondaryBtn);
      textStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      btnStyle.push(styles.outlineBtn);
      textStyle.push(styles.outlineText);
    } else if (variant === 'danger') {
      btnStyle.push(styles.dangerBtn);
      textStyle.push(styles.dangerText);
    } else if (variant === 'ghost') {
      btnStyle.push(styles.ghostBtn);
      textStyle.push(styles.ghostText);
    }

    // Size styles
    if (size === 'sm') {
      btnStyle.push(styles.smBtn);
      textStyle.push(styles.smText);
    } else if (size === 'lg') {
      btnStyle.push(styles.lgBtn);
      textStyle.push(styles.lgText);
    } else {
      btnStyle.push(styles.mdBtn);
      textStyle.push(styles.mdText);
    }

    if (disabled || loading) {
      btnStyle.push(styles.disabledBtn);
    }

    return { btnStyle, textStyle };
  };

  const { btnStyle, textStyle } = getStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[btnStyle, style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#0ea5e9' : '#ffffff'}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Variants
  primaryBtn: {
    backgroundColor: '#0ea5e9', // Primary Blue
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryBtn: {
    backgroundColor: '#FF5E13', // Metrolínea Orange
    shadowColor: '#FF5E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  outlineText: {
    color: '#F8FAFC',
  },
  dangerBtn: {
    backgroundColor: '#EF4444',
  },
  dangerText: {
    color: '#ffffff',
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#0ea5e9',
  },
  // Sizes
  smBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  smText: {
    fontSize: 13,
  },
  mdBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  mdText: {
    fontSize: 15,
  },
  lgBtn: {
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  lgText: {
    fontSize: 17,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
export default AppButton;
