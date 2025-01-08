import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import {catchError, from, tap} from "rxjs";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {SystemForm} from "./system-form.tsx";
import {RoleDTO} from "../../../services/role/role-dto.ts";
import {RoleForm} from "./role-form.tsx";
import {roleService} from "../../../services/role";

export const RoleDetail = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [data, setData] = useState<RoleDTO>();

  const getData = async () => {
    if(!id) return;
    from(roleService.getRoleById(id)).pipe(
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
  }, [isAuthenticated,id]);

  return (
    <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
      {data && (
          <div className="w-full max-w-xl mt-6">
            <div className="mx-auto w-128 space-y-4">
              <RoleForm client={data?.client} readonly={true} initialData={data} />
            </div>
          </div>
      )}
    </section>
  );
};
