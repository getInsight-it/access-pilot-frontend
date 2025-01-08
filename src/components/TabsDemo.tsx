import { Tabs } from "../components/tabs/tabs";
import GridList from "./GridList";
import GridListNoAccess from "./GridListNoAccess";

export function TabsDemo() {
  const tabs = [
    {
      title: "Sistemas que você tem acesso",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Selecionar sistema</p> */}
          <GridList />
        </div>
      ),
    },
    {
      title: "Sistemas que você pode solicitar acesso",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          <GridListNoAccess />
        </div>
      ),
    },
    // {
    //   title: "3",
    //   value: "playground",
    //   content: (
    //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
    //       <p>Motivo</p>
    //     </div>
    //   ),
    // },
    // {
    //   title: "4",
    //   value: "content",
    //   content: (
    //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
    //       <p>Anexos</p>
    //     </div>
    //   ),
    // },
    // {
    //   title: "5",
    //   value: "random",
    //   content: (
    //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
    //       <p>Resumo</p>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="h-[20rem] md:h-[30rem] [perspective:1000px] relative b flex flex-col w-full items-start justify-start mt-10">
      <Tabs tabs={tabs} />
    </div>
  );
}


