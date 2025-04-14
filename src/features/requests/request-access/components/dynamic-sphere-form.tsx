import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.tsx";
import { levelService } from "../../../level/common/api/level-service.ts";

const DynamicSphereForm = ({ initialId }: any) => {
  const [spheresData, setSpheresData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spheres = await levelService.getLevelHierarchy(initialId);
        const results = await Promise.all(
          spheres.map(async (sphere: any) => {
            const pageableItems = await levelService.getLevelItems(sphere.id);
            return { sphere, items: pageableItems.items };
          })
        );
        setSpheresData(results);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialId]);

  const handleSelectionChange = async (index: number, selectedValue: string) => {
    if (index < spheresData.length - 1) {
      const nextSphereData = spheresData[index + 1];
      const newItems = [];
      setSpheresData((prev) => {
        const updated = [...prev];
        updated[index + 1] = {
          ...updated[index + 1],
          items: newItems,
        };
        return updated;
      });
    }
  };

  if (loading) {
    return <div>Carregando esferas...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {spheresData.map(({ sphere, items }, index) => (
        <div key={sphere.id} className="flex items-center">
          <Select
            defaultValue=""
            onValueChange={(value: string) => handleSelectionChange(index, value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue className="text-black" placeholder={sphere.name} />
            </SelectTrigger>
            <SelectContent>
              {items && items.length > 0 ? (
                items.map((item: any) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="a">No items available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default DynamicSphereForm;
