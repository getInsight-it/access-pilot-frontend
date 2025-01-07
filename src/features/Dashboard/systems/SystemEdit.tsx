import React, {useEffect, useState} from "react";
import { Detail } from "./Detail";
import {useParams} from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import {catchError, from, tap} from "rxjs";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {SystemForm} from "./system-form.tsx";

export const SystemEdit = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { clientId } = useParams();
  const [data, setData] = useState<ClientDTO>();

  const onUpdate = () => {
    getData();
  }

  const getData = async () => {
    if(!clientId) return;
    from(clientService.fetchByClientId(clientId)).pipe(
      tap((response) => {
        if (response){
          setData(response)
        }
      }),catchError((error) => {
        console.error(error);
        return [];
      }
    )).subscribe();
  };

  useEffect(() => {
    getData();
  }, [isAuthenticated,clientId]);

  return (
    <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
      {data && (
          <div className="w-full max-w-xl mt-6">
            <div className="mx-auto w-128 space-y-4">
              <SystemForm
                initialData={data || null} readonly={false} onSuccessSubmit={() => console.log('success')}
              />
            </div>
          </div>
      )}
    </section>
  );
};
