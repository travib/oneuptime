import React, { FunctionComponent, useState } from 'react';
import ModelForm, { FormType } from 'CommonUI/src/Components/Forms/ModelForm';
import Link from 'CommonUI/src/Components/Link/Link';
import Route from 'Common/Types/API/Route';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import Navigation from 'CommonUI/src/Utils/Navigation';
import UserUtil from '../../Utils/User';
import StatusPagePrivateUser from 'Model/Models/StatusPagePrivateUser';
import { FILE_URL } from 'CommonUI/src/Config';
import URL from 'Common/Types/API/URL';
import { RESET_PASSWORD_API_URL } from '../../Utils/ApiPaths';
import ObjectID from 'Common/Types/ObjectID';

export interface ComponentProps {
    statusPageId: ObjectID | null;
    isPreviewPage: boolean;
    statusPageName: string;
    logoFileId: ObjectID;
    isPrivatePage: boolean;
}

const ResetPassword: FunctionComponent<ComponentProps> = (
    props: ComponentProps
) => {
    const apiUrl: URL = RESET_PASSWORD_API_URL;
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    if (!props.statusPageId) {
        return <></>;
    }

    if (UserUtil.isLoggedIn(props.statusPageId)) {
        Navigation.navigate(
            new Route(
                props.isPreviewPage ? `/status-page/${props.statusPageId}` : '/'
            )
        );
    }

    if (!props.isPrivatePage) {
        Navigation.navigate(
            new Route(
                props.isPreviewPage ? `/status-page/${props.statusPageId}` : '/'
            )
        );
    }

    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {props.logoFileId && props.logoFileId.toString() ? (
                    <img
                        style={{ height: '70px' }}
                        src={`${URL.fromString(FILE_URL.toString()).addRoute(
                            '/image/' + props.logoFileId.toString()
                        )}`}
                    />
                ) : (
                    <></>
                )}
                <h2 className="mt-6 text-center text-2xl  tracking-tight text-gray-900">
                    Create a new password for your {props.statusPageName}{' '}
                    account.
                </h2>

                {!isSuccess && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password and we will have it
                        updated.{' '}
                    </p>
                )}

                {isSuccess && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Your password has been updated. Please log in.
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                {!isSuccess && (
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <ModelForm<StatusPagePrivateUser>
                            modelType={StatusPagePrivateUser}
                            id="register-form"
                            name="Status Page > Reset Password"
                            onBeforeCreate={(item: StatusPagePrivateUser) => {
                                item.resetPasswordToken =
                                    Navigation.getLastParam()
                                        ?.toString()
                                        .replace('/', '')
                                        .toString() || '';
                                return item;
                            }}
                            showAsColumns={1}
                            maxPrimaryButtonWidth={true}
                            initialValues={{
                                password: '',
                                confirmPassword: '',
                            }}
                            fields={[
                                {
                                    field: {
                                        password: true,
                                    },
                                    forceShow: true,
                                    fieldType: FormFieldSchemaType.Password,
                                    validation: {
                                        minLength: 6,
                                    },
                                    placeholder: 'New Password',
                                    title: 'New Password',
                                    required: true,
                                },
                                {
                                    field: {
                                        password: true,
                                    },
                                    validation: {
                                        minLength: 6,
                                        toMatchField: 'password',
                                    },
                                    forceShow: true,
                                    fieldType: FormFieldSchemaType.Password,
                                    placeholder: 'Confirm Password',
                                    title: 'Confirm Password',
                                    overideFieldKey: 'confirmPassword',
                                    required: true,
                                },
                            ]}
                            apiUrl={apiUrl}
                            formType={FormType.Create}
                            submitButtonText={'Reset Password'}
                            onSuccess={() => {
                                setIsSuccess(true);
                            }}
                        />
                    </div>
                )}
                <div className="mt-10 text-center">
                    <p className="text-muted mb-0 text-gray-500">
                        Know your password?{' '}
                        <Link
                            to={
                                new Route(
                                    props.isPreviewPage
                                        ? `/status-page/${props.statusPageId}/login`
                                        : '/login'
                                )
                            }
                            className="text-indigo-500 hover:text-indigo-900 cursor-pointer"
                        >
                            Log in.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
