import React, {useEffect, useState} from "react";
import { Detail } from "./Detail";
import { StorageDTO } from "../../services/storage/storage-dto";
import {useParams} from "react-router-dom";
import useAuthStore from "../../store/authStore.ts";
import {RequestModel} from "../../features/requests/common/types/request.model.ts";
import {catchError, from, tap} from "rxjs";
import {storageService} from "../../services/storage";
import { requestService } from "../../features/requests/common/api/request-service.ts";

export const RequestDetail = ({
                                origin
                              }: {
  origin?: string
}) => {


  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [data, setData] = useState<RequestModel>();

  const onUpdate = () => {
    getData();
  }
  const [attachments, setAttachments] = useState<StorageDTO[]>([]);
  const handleAttachments = (ownerId: string) => {
    if (isAuthenticated) {
      getStorageData(ownerId, 1, 1000);
    }
  }

  const getStorageData = async (ownerId : string, pageIndex: number, pageCount: number) => {
    const pageResponse = await storageService.getStoragesPaginated(ownerId, pageIndex, pageCount, "id", "asc");
    setAttachments(pageResponse?.items || []);
  };


  useEffect(() => {
    if (data?.uuid) {
      handleAttachments(data?.uuid);
    }
  }, [data, isAuthenticated]);

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
