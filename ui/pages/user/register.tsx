import NavPage from '../../components/navPage'
import PrimaryAppBar from '../../components/primaryAppbar'
import BottomNav from '../../components/bottom-nav'
import { Button, Container, Stack, Typography } from '@mui/material'
import { Form, Formik } from "formik";
import User from "@/models/user";
import * as Yup from 'yup';
import { postModel } from '@/utils/nodeInterface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TextInput } from '@/components/formFields';
import DelphaiInterface from '@/contracts/delphaiInterface';

interface UserFormData {
    displayName: string;
    flowAddress: string;
}

export default function Register() {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string>();
    const [delphai, setDelphai] = useState<DelphaiInterface>();

    useEffect(() => {
        setDelphai(new DelphaiInterface());
    }, []);
    
    const appBar = <PrimaryAppBar name="Register" />
    const navLinks = [
        {
            label: "About",
            href: "/about",
            icon: (
                <div>About</div>
            )
        }
    ]
    const bottomNav = <BottomNav links={navLinks} />


    const createUser = async (user: UserFormData) => {
        const result = await (await postModel<User>("/api/user", user))
            .mapErr(err => setSubmitError(err))
            .map(async _ => {
                if (!delphai) return false;
                return (await delphai.saveDelphaiUser())
                    .map(_ => router.push("/groups"))
                    .mapErr(err => setSubmitError(err))
                    .isOk();
            });
        return result.isOk() && result.unwrap();
    }

    return (
        <NavPage title="Register"
            appBar={appBar}
            bottomNav={bottomNav}
        >
            <Container>
                <Formik
                    initialValues={{
                        displayName: "",
                        flowAddress: ""
                    }}
                    validationSchema={Yup.object({
                        displayName: Yup.string().required("Required"),
                        flowAddress: Yup.string()
                            .required("Required")
                            .matches(/(?:0x)?[0-9a-hA-H]{16}/, "Must be a valid Flow address")
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        const result = await createUser({ ...values });
                        setSubmitting(false);
                        return result;
                    }}
                >
                    <Form>
                        <Stack spacing={1} marginTop={2}>
                            <Typography variant="h5">
                                User Registration
                            </Typography>
                            <TextInput label="Display Name"
                                name="displayName"
                                type="text"
                                placeholder="Display Name"
                            />
                            <TextInput label="Flow Address"
                                name="flowAddress"
                                type="text"
                                placeholder="Flow Address"
                            />
                            <Button type="submit"
                                variant="contained"
                            >
                                Register
                            </Button>
                            {submitError && <div className="error">{submitError}</div>}
                        </Stack>
                    </Form>
                </Formik>
            </Container>
        </NavPage>
    )
}