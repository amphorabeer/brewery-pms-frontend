import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Recipe {
  name: string;
  style: string;
  batchSize: number;
  abv?: number;
  ibu?: number;
  og?: number;
  fg?: number;
  mashTemp?: number;
  mashTime?: number;
  boilTime?: number;
  fermentTemp?: number;
  fermentDays?: number;
  notes?: string;
  ingredients?: Array<{
    ingredient: { name: string; type: string };
    quantity: number;
    unit: string;
    timing?: string;
    notes?: string;
  }>;
}

export const generateBrewSheetPDF = (recipe: Recipe) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(recipe.name, 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(recipe.style, 20, 28);
  
  // Recipe Stats
  let yPos = 40;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recipe Statistics', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const stats = [
    ['Batch Size:', `${recipe.batchSize} L`],
    ['ABV:', recipe.abv ? `${recipe.abv}%` : 'N/A'],
    ['IBU:', recipe.ibu ? `${recipe.ibu}` : 'N/A'],
    ['Original Gravity:', recipe.og ? `${recipe.og}` : 'N/A'],
    ['Final Gravity:', recipe.fg ? `${recipe.fg}` : 'N/A'],
  ];
  
  stats.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.text(value, 70, yPos);
    yPos += 6;
  });
  
  // Ingredients Table
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ingredients', 20, yPos);
    
    yPos += 5;
    
    const ingredientsData = recipe.ingredients.map((item) => [
      item.ingredient.name,
      item.ingredient.type,
      `${item.quantity} ${item.unit}`,
      item.timing || '-',
      item.notes || '-',
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Ingredient', 'Type', 'Quantity', 'Timing', 'Notes']],
      body: ingredientsData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Brewing Parameters
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Brewing Parameters', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const brewingParams = [
    ['Mash Temperature:', recipe.mashTemp ? `${recipe.mashTemp}°C` : 'N/A'],
    ['Mash Time:', recipe.mashTime ? `${recipe.mashTime} min` : 'N/A'],
    ['Boil Time:', recipe.boilTime ? `${recipe.boilTime} min` : 'N/A'],
    ['Fermentation Temp:', recipe.fermentTemp ? `${recipe.fermentTemp}°C` : 'N/A'],
    ['Fermentation Days:', recipe.fermentDays ? `${recipe.fermentDays} days` : 'N/A'],
  ];
  
  brewingParams.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.text(value, 80, yPos);
    yPos += 6;
  });
  
  // Notes
  if (recipe.notes) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const splitNotes = doc.splitTextToSize(recipe.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Brew Sheet - ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF
  const fileName = `${recipe.name.replace(/\s+/g, '_')}_brew_sheet.pdf`;
  doc.save(fileName);
};
