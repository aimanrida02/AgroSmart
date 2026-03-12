import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import i18n from '../i18n/i18n';

const SoilHistoryScreen = ({ navigation }) => {
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

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  // Mock soil history data
  const soilData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [6.5, 6.7, 6.8, 7.0, 7.1, 7.2],
        color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [45, 48, 52, 55, 58, 60],
        color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [i18n.t('ph'), i18n.t('moisture')],
  };

  const soilMetrics = [
    { label: i18n.t('nitrogen'), value: '85 mg/kg', color: '#4CAF50' },
    { label: i18n.t('phosphorus'), value: '42 mg/kg', color: '#2196F3' },
    { label: i18n.t('potassium'), value: '120 mg/kg', color: '#FF9800' },
    { label: i18n.t('organicMatter'), value: '3.2%', color: '#9C27B0' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('soilHistory')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{i18n.t('soilParametersOverTime')}</Text>
          <LineChart
            data={soilData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              style: { borderRadius: 8 },
            }}
            style={styles.chart}
          />
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>{i18n.t('currentSoilMetrics')}</Text>
          <View style={styles.metricsGrid}>
            {soilMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View
                  style={[styles.metricColor, { backgroundColor: metric.color }]}
                />
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Soil Health Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{i18n.t('soilHealth')}</Text>
          <View style={styles.healthBar}>
            <View style={[styles.healthBarFill, { width: '78%' }]} />
          </View>
          <Text style={styles.healthText}>
            78% - {i18n.t('good')} 🌱
          </Text>
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
    paddingTop: 15,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 8,
  },
  metricsContainer: {
    marginBottom: 20,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  healthBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  healthText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SoilHistoryScreen;