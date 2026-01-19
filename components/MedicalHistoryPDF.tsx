"use client";

import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { LucidePrinter, LucideLoader2 } from 'lucide-react';

Font.register({
  family: 'Roboto',
  fonts: [
    { 
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', 
      fontWeight: 400 
    },
    { 
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', 
      fontWeight: 700 
    },
    { 
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', 
      fontStyle: 'italic',
      fontWeight: 400
    }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 11 },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 5, marginTop: 10, marginBottom: 5 },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 100, fontWeight: 'bold', color: '#666' },
  value: { flex: 1 },
  visitContainer: { marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  visitDate: { fontWeight: 'bold', fontSize: 12 },
  diagnosis: { color: '#b91c1c', marginTop: 2, fontWeight: 'bold' }
});

interface PDFProps {
  pet: {
    name: string;
    species: string;
    breed: string | null;
    sex: string;
    birthDate: Date;
    owner: {
      name: string;
      lastName: string;
      email: string;
      phone: string | null;
    };
    visits: any[];
  };
}

const MedicalDoc = ({ pet }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historia Choroby</Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Przychodnia Weterynaryjna</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10 }}>Data: {new Date().toLocaleDateString('pl-PL')}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.sectionTitle}>PACJENT</Text>
          <View style={styles.row}><Text style={styles.label}>Imię:</Text><Text style={styles.value}>{pet.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Gatunek:</Text><Text style={styles.value}>{pet.species}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Rasa:</Text><Text style={styles.value}>{pet.breed || '-'}</Text></View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>WŁAŚCICIEL</Text>
          <View style={styles.row}><Text style={styles.label}>Właściciel:</Text><Text style={styles.value}>{pet.owner.name} {pet.owner.lastName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Telefon:</Text><Text style={styles.value}>{pet.owner.phone || '-'}</Text></View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>PRZEBIEG LECZENIA</Text>
      {pet.visits.length === 0 ? (
        <Text style={{ fontStyle: 'italic', color: '#666', marginTop: 10 }}>Brak zarejestrowanych wizyt.</Text>
      ) : (
        pet.visits.map((visit: any, index: number) => (
          <View key={index} style={styles.visitContainer}>
            <View style={styles.visitHeader}>
              <Text style={styles.visitDate}>
                {new Date(visit.date).toLocaleDateString('pl-PL')} | {visit.type.toUpperCase()}
              </Text>
              {visit.vet && (
                <Text style={{ fontSize: 10, color: '#666' }}>Lek. {visit.vet.name} {visit.vet.lastName}</Text>
              )}
            </View>
            <Text style={{ marginBottom: 4 }}>{visit.description}</Text>
            {visit.diagnosis && <Text style={styles.diagnosis}>Diagnoza: {visit.diagnosis}</Text>}
          </View>
        ))
      )}
      <Text style={{ position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 9, textAlign: 'center', color: '#999' }}>
        Dokument wygenerowany automatycznie.
      </Text>
    </Page>
  </Document>
);

export default function DownloadHistoryButton({ pet }: PDFProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button disabled className="bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-wait">
         <LucideLoader2 className="animate-spin" size={18} />
         Przygotowywanie...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<MedicalDoc pet={pet} />}
      fileName={`Historia_${pet.name}_${new Date().toISOString().slice(0,10)}.pdf`}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-bold no-underline"
    >
      {({ loading }: { loading: boolean }) => (
         loading ? (
           <>
             <LucideLoader2 className="animate-spin" size={18} />
             Generowanie...
           </>
         ) : (
           <>
             <LucidePrinter size={18} />
             Pobierz PDF
           </>
         )
      )}
    </PDFDownloadLink>
  );
}