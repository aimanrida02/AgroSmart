import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import i18n from '../i18n/i18n';

const SoilRecommendationScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      }
    };
    loadLanguage();
  }, []);

  const recommendations = [
    {
      title: i18n.t('recommendedCrop'),
      value: i18n.t('wheat'),
      color: '#8B4513',
      icon: '🌾',
    },
    {
      title: i18n.t('alternativeCrop'),
      value: i18n.t('chickpea'),
      color: '#DAA520',
      icon: '🫘',
    },
  ];

  const fertilizers = [
    {
      name: 'NPK 10:26:26',
      quantity: '150 kg/acre',
      cost: '₹2,250',
      purpose: i18n.t('forYield'),
    },
    {
      name: 'Urea',
      quantity: '50 kg/acre',
      cost: '₹500',
      purpose: i18n.t('forGrowth'),
    },
    {
      name: 'DAP',
      quantity: '75 kg/acre',
      cost: '₹1,125',
      purpose: i18n.t('forRoot'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('soilRecommendation')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Crop Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌱 {i18n.t('cropRecommendation')}</Text>
          <View style={styles.cardsContainer}>
            {recommendations.map((rec, index) => (
              <View
                key={index}
                style={[styles.recommendationCard, { borderLeftColor: rec.color }]}
              >
                <Text style={styles.cardIcon}>{rec.icon}</Text>
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>{rec.title}</Text>
                  <Text style={styles.cardValue}>{rec.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Fertilizer Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 {i18n.t('fertilizerRecommendation')}</Text>
          {fertilizers.map((fert, index) => (
            <View key={index} style={styles.fertilizerCard}>
              <View style={styles.fertilizerHeader}>
                <Text style={styles.fertilizerName}>{fert.name}</Text>
                <Text style={styles.fertilizerCost}>{fert.cost}</Text>
              </View>
              <Text style={styles.fertilizerQuantity}>{fert.quantity}</Text>
              <Text style={styles.fertilizerPurpose}>{fert.purpose}</Text>
            </View>
          ))}
        </View>

        {/* Cost Summary */}
        <View style={styles.costSummary}>
          <Text style={styles.costTitle}>{i18n.t('estimatedCost')}</Text>
          <View style={styles.costBreakdown}>
            {fertilizers.map((fert, index) => (
              <View key={index} style={styles.costRow}>
                <Text style={styles.costLabel}>{fert.name}</Text>
                <Text style={styles.costValue}>{fert.cost}</Text>
              </View>
            ))}
            <View style={styles.costDivider} />
            <View style={styles.costRow}>
              <Text style={styles.costLabelBold}>{i18n.t('total')}</Text>
              <Text style={styles.costValueBold}>₹3,875</Text>
            </View>
          </View>
        </View>

        {/* Yield Impact */}
        <View style={styles.yieldCard}>
          <Text style={styles.yieldTitle}>📈 {i18n.t('estimatedYieldIncrease')}</Text>
          <Text style={styles.yieldValue}>25-30%</Text>
          <Text style={styles.yieldText}>
            {i18n.t('withRecommendedFertilizer')}
          </Text>
        </View>

        {/* Soil Health Impact */}
        <View style={styles.healthCard}>
          <Text style={styles.healthTitle}>🌿 {i18n.t('soilHealthImpact')}</Text>
          <View style={styles.healthMetrics}>
            <View style={styles.healthMetric}>
              <Text style={styles.metricLabel}>{i18n.t('nitrogen')}</Text>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '85%' }]} />
              </View>
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.metricLabel}>{i18n.t('phosphorus')}</Text>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '92%' }]} />
              </View>
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.metricLabel}>{i18n.t('potassium')}</Text>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '88%' }]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2E8B57',
  },
  backButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  cardsContainer: {
    gap: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fertilizerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fertilizerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fertilizerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  fertilizerCost: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  fertilizerQuantity: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  fertilizerPurpose: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  costSummary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  costTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  costBreakdown: {
    gap: 10,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costValue: {
    fontSize: 14,
    color: '#333',
  },
  costLabelBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  costValueBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  costDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  yieldCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  yieldTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E8B57',
    marginBottom: 10,
  },
  yieldValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  yieldText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  healthMetrics: {
    gap: 15,
  },
  healthMetric: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: '#666',
  },
  healthBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});

export default SoilRecommendationScreen;