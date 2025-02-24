import React, { ReactElement, useEffect, useState } from 'react';
import BaseModel from 'Common/Models/BaseModel';
import Query from '../../Utils/ModelAPI/Query';
import ModelAPI, { RequestOptions } from '../../Utils/ModelAPI/ModelAPI';
import HTTPErrorResponse from 'Common/Types/API/HTTPErrorResponse';
import { IconProp } from '../Icon/Icon';
import HeaderAlert from './HeaderAlert';

export interface ComponentProps<TBaseModel extends BaseModel> {
    icon: IconProp;
    modelType: { new (): TBaseModel };
    singularName: string;
    pluralName: string;
    query: Query<TBaseModel>;
    requestOptions?: RequestOptions | undefined;
    onCountFetchInit?: (() => void) | undefined;
    onClick?: (() => void) | undefined;
    refreshToggle?: boolean | undefined;
    className?: string | undefined;
}

const HeaderModelAlert: Function = <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
): ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        fetchCount();
    }, [props.refreshToggle]);

    const fetchCount: Function = async () => {
        setError('');
        setIsLoading(true);

        if (props.onCountFetchInit) {
            props.onCountFetchInit();
        }

        try {
            const count: number = await ModelAPI.count<TBaseModel>(
                props.modelType,
                props.query,
                props.requestOptions
            );

            setCount(count);
        } catch (err) {
            try {
                setError(
                    (err as HTTPErrorResponse).message ||
                        'Server Error. Please try again'
                );
            } catch (e) {
                setError('Server Error. Please try again');
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchCount();
        setIsLoading(false);
    }, []);

    if (error) {
        return <></>;
    }

    if (isLoading) {
        return <></>;
    }

    if (count === 0) {
        return <></>;
    }

    return (
        <HeaderAlert
            title={`${count} ${
                count > 1 ? props.pluralName : props.singularName
            }`}
            icon={props.icon}
            onClick={props.onClick}
            className={props.className}
        />
    );
};

export default HeaderModelAlert;
