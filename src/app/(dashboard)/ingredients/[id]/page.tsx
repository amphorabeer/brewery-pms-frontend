import EditIngredientClient from './EditIngredientClient';

export default async function EditIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <EditIngredientClient id={id} />;
}