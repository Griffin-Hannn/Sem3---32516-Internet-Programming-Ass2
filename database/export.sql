--
-- PostgreSQL database dump
--

\restrict FYlh6HUlZ9tI53IBanDiq9eRy8xqnmX2GUTlkAb6aO0BzHRgwRoMFjBFiJblser

-- Dumped from database version 14.21 (Homebrew)
-- Dumped by pg_dump version 14.21 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    user_id character varying(50) NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense (
    id character varying(50) NOT NULL,
    title character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    amount double precision NOT NULL,
    date date NOT NULL,
    description character varying(255),
    user_id character varying(50),
    category_id character varying(50)
);


ALTER TABLE public.expense OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    is_active boolean NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, user_id) FROM stdin;
75da2a82-6629-47e8-8234-bf99888ef745	Food	6f22a04f-c075-4cb0-af2c-37181cc2e7fb
7ecec272-77e7-40be-9b1d-cc1af81821df	Transport	6f22a04f-c075-4cb0-af2c-37181cc2e7fb
ed67e6b5-7196-4352-bdee-25bc28d6d4e1	Groceries	6f22a04f-c075-4cb0-af2c-37181cc2e7fb
1aba9c1c-849f-4cf2-b636-f8f1da6ad0ea	Entertainment	6f22a04f-c075-4cb0-af2c-37181cc2e7fb
1d3ea8e0-4bad-4997-a242-c4666e6562f3	Utilities	6f22a04f-c075-4cb0-af2c-37181cc2e7fb
556aca2d-8c47-4c5e-998b-aea484196dfe	Food	780f8aac-bcd5-42a6-82fa-26765c1ac79e
37fae557-4c96-4da5-a1a0-65999bbb12b1	Study	780f8aac-bcd5-42a6-82fa-26765c1ac79e
3224994b-17a1-4101-8fe0-45e8add9d4b5	Transport	780f8aac-bcd5-42a6-82fa-26765c1ac79e
19f824ca-e3bd-450b-9b73-43332b7e2c76	Health	780f8aac-bcd5-42a6-82fa-26765c1ac79e
\.


--
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense (id, title, category, amount, date, description, user_id, category_id) FROM stdin;
2026-05-11T10:23:02.988Z	Breakfast Bread	Food	6	2026-04-11		780f8aac-bcd5-42a6-82fa-26765c1ac79e	556aca2d-8c47-4c5e-998b-aea484196dfe
2026-05-11T10:18:07.244Z	Lunch at campus cafe	Food	13.5	2026-04-10		6f22a04f-c075-4cb0-af2c-37181cc2e7fb	75da2a82-6629-47e8-8234-bf99888ef745
2026-05-11T10:18:20.804Z	Train to city	Transport	4.8	2026-04-10		6f22a04f-c075-4cb0-af2c-37181cc2e7fb	7ecec272-77e7-40be-9b1d-cc1af81821df
2026-05-11T10:19:00.120Z	Weekly groceries	Groceries	56.2	2026-04-12		6f22a04f-c075-4cb0-af2c-37181cc2e7fb	ed67e6b5-7196-4352-bdee-25bc28d6d4e1
2026-05-11T10:19:18.325Z	Movie ticket	Entertainment	18	2026-04-12		6f22a04f-c075-4cb0-af2c-37181cc2e7fb	1aba9c1c-849f-4cf2-b636-f8f1da6ad0ea
2026-05-11T10:19:49.579Z	Electricity bill	Utilities	92.4	2026-12-04		6f22a04f-c075-4cb0-af2c-37181cc2e7fb	1d3ea8e0-4bad-4997-a242-c4666e6562f3
2026-05-11T10:21:13.977Z	Coffee	Food	5.5	2026-04-11		780f8aac-bcd5-42a6-82fa-26765c1ac79e	556aca2d-8c47-4c5e-998b-aea484196dfe
2026-05-11T10:21:34.736Z	Notebook	Study	7.2	2026-04-11		780f8aac-bcd5-42a6-82fa-26765c1ac79e	37fae557-4c96-4da5-a1a0-65999bbb12b1
2026-05-11T10:21:52.583Z	Bus fare	Transport	3.6	2026-04-11		780f8aac-bcd5-42a6-82fa-26765c1ac79e	3224994b-17a1-4101-8fe0-45e8add9d4b5
2026-05-11T10:22:22.161Z	Pharmacy purchase	Health	16.9	2026-04-13		780f8aac-bcd5-42a6-82fa-26765c1ac79e	19f824ca-e3bd-450b-9b73-43332b7e2c76
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, name, hashed_password, role, is_active) FROM stdin;
6f22a04f-c075-4cb0-af2c-37181cc2e7fb	alice@example.com	Alice	$2b$12$mOSN/1MiN1AgzzfKH3NXhOMwnxuTVEZxz/ebVnm9.8pxJ2oWgC7s2	user	t
780f8aac-bcd5-42a6-82fa-26765c1ac79e	ben@example.com	Ben	$2b$12$q8f.zgUUaC2TLuk88jHUvOIJu6AGJp.sMYkDFZZPc4V5jAH/aSK7m	user	t
971995ce-6d1b-4ef7-8994-e734fb505bf6	admin@example.com	Admin	$2b$12$lurIUSGsxZvgfsjZ084Nt.4yZ/F/zw1l.kVroxE56R4.qA8FGRiym	admin	t
\.


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_category_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_category_user_id ON public.category USING btree (user_id);


--
-- Name: ix_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);


--
-- Name: category category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict FYlh6HUlZ9tI53IBanDiq9eRy8xqnmX2GUTlkAb6aO0BzHRgwRoMFjBFiJblser

