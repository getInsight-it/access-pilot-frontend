"use client";

import Image from "next/image";
import { Tabs } from "@/components/tabs/tabs";

export function TabsDemo() {
  const tabs = [
    {
      title: "Visão Geral dos Acessos",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Tab 1</p> */}
          {/* <DummyContent /> */}
          <h2>
            Visão Geral dos Acessos:
          </h2>
          <ul className="mt-4">
            <li className="">
              - Total de usuários registrados.
            </li>
            <li className="">
              - Número de usuários ativos/inativos.
            </li>
            <li className="">
              - Número total de sistemas e roles disponíveis.
            </li>
            <li className="">
              - Gráfico de distribuição de usuários por role/sistema.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Solicitações de Acesso",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Tab 2</p> */}
          {/* <DummyContent /> */}
          <h2>
            Solicitações de Acesso:
          </h2>
          <ul className="mt-4">
            <li>
              - Número de solicitações de acesso pendentes.
            </li>
            <li>
              - Solicitações de acesso aprovadas/rejeitadas nas últimas 24 horas/semana/mês.
            </li>
            <li>
              - Lista de solicitações recentes com status (pendente, aprovado, rejeitado).
            </li>
            <li>
              - Gráfico de tendências de solicitações de acesso ao longo do tempo.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Atividades Recentes",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Tab 3</p> */}
          {/* <DummyContent /> */}
          <h2>
            Atividades Recentes:
          </h2>

          <ul className="mt-4">
            <li>
              - Últimas atividades dos usuários (logins, solicitações de acesso, alterações de permissões).
            </li>
            <li>
              - Registro de auditoria de mudanças feitas por administradores.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Métricas de Desempenho do Sistema",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Tab 4</p>
          <DummyContent /> */}
          <h2>
            Métricas de Desempenho do Sistema
          </h2>
          <ul className="mt-4">
            <li>
              - Tempo médio de resposta para aprovações de acesso.
            </li>
            <li>
              - Tempo médio de resolução de incidentes.
            </li>
            <li>
              - Disponibilidade do sistema.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Gerenciamento de Permissões",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          {/* <p>Tab 5</p>
          <DummyContent /> */}
          <h2>
            Gerenciamento de Permissões
          </h2>
          <ul className="mt-4">
            <li>
              - Lista de roles com maior número de usuários.
            </li>
            <li>
              - Sistemas com maior número de solicitações de acesso.
            </li>
            <li>
              - Análise de roles raramente usadas ou redundantes.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[30rem] [perspective:1000px] relative b flex flex-col w-full items-start justify-start mt-10">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <Image
      src="/ap.svg"
      alt="dummy image"
      width="1000"
      height="1000"
      className=" object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
