import React, {useEffect, useState} from "react";
import { Tag } from "./Tag";
import { Detail } from "./Detail";
import { StorageDTO } from "../../services/storage/storage-dto";
import {useParams} from "react-router-dom";
import {requestService} from "../../services/request";
import useAuthStore from "../../store/authStore.ts";
import {RequestDTO} from "../../services/request/request-d-t-o.ts";
import {catchError, from, tap} from "rxjs";

export const RequestDetail = ({
                                attachments,
                                origin
                              }: {
  attachments?: StorageDTO[],
  origin?: string
}) => {


  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [data, setData] = useState<RequestDTO>();

  const onUpdate = () => {
    getData();
  }

  const getData = async () => {
    if(!id) return;
    from(requestService.findRequestById(id)).pipe(
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
      <Detail data={data} attachments={attachments} onUpdate={onUpdate} origin={origin}/>
  );
};
