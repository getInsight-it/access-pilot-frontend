import { FeatureGrid } from '@/components/grid/FeatureGrid';
import GridList from '@/components/GridList';
import GridListNoAccess from '@/components/GridListNoAccess';
import { Stripe } from '@/components/stripe/Stripe';
// import { TabsDemo } from '@/components/TabsDemo';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';


export default function Page() {
  

  return (
    <ScrollArea className="h-full">
      
      {/* admin dashboard */}
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 mt-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
        <FeatureGrid />
      </div>

      {/* user dashboard */}
      <div className="hidden flex-1 space-y-4 p-4 pt-6 md:p-8 mt-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[4fr_2fr] gap-10">
          <GridList />
          <div></div>
          <GridListNoAccess />
        </div>
      </div>

      <Stripe />
    </ScrollArea>
  );
}
