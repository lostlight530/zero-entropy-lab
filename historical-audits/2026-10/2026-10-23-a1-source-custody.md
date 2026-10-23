# A1 | zero-entropy-lab | October 01–22 source-custody audit

- Repository: `lostlight530/zero-entropy-lab`
- Exact current main: `58c78555ec01e5c2c2588ff4bbddb4a4f537901a`
- Previous admitted A2 relation: `historical-audits/2026-10/2026-10-21-a2-month-relation.md` at blob `c81f51878dc6612629539b9f51c79b09a1310f23`
- Audit window: 2026-10-01 through 2026-10-22 inclusive (N−1 cutoff for 2026-10-23)
- Method: compare each previous A2 source identity against the live main recursive Git tree; source path presence is not an execution ledger
- Prior A2 source objects: 63; unchanged: 63; changed: 0; missing: 0
- New N−1 native/evidence objects: 3; source objects in this cutoff: 66
- Current N-day source objects detected but excluded from A1: 3; reserve these for A2 after the A1 merge
- System boundary: Aegis Cortex, Ballast and Zero Host Kernel remain separate; this audit is not a local runtime replay
- October A6 / Ballast month close remains OPEN / NOT_DUE

## Per-file explicit custody decisions

| Source path | Prior A2 Git blob | Live main Git blob | Bytes | A1 decision |
|---|---|---|---:|---|
| `aegis-cortex/2026-10-01-A1-reliability-observe.md` | `461882e16809ef9b442b3c6d47b45f44418660b5` | `461882e16809ef9b442b3c6d47b45f44418660b5` | 6438 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-01-A2-doctrine-orient.md` | `450bb5e41ba1f4f52f605632a3522797568429c5` | `450bb5e41ba1f4f52f605632a3522797568429c5` | 3188 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-01.md` | `21a2dbd84f4a7e05bc64f78aa934d824a4a96593` | `21a2dbd84f4a7e05bc64f78aa934d824a4a96593` | 12421 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-02-A1-reliability-observe.md` | `abe20d48251fc36893884f355421e896e3f3631a` | `abe20d48251fc36893884f355421e896e3f3631a` | 6538 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-02-A2-doctrine-orient.md` | `c590dffb8dc28fb701174e6dfafe2c3697f97b37` | `c590dffb8dc28fb701174e6dfafe2c3697f97b37` | 4018 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-02.md` | `1081112e8ef7f9c1d3e4415c2cf1edb297419a58` | `1081112e8ef7f9c1d3e4415c2cf1edb297419a58` | 12361 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-03-A1-reliability-observe.md` | `0f37ab4b605a24006a862a9837564a459c0c1298` | `0f37ab4b605a24006a862a9837564a459c0c1298` | 6295 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-03-A2-doctrine-orient.md` | `3c95e23cfa6187d0c23f607d622e2e8353051b13` | `3c95e23cfa6187d0c23f607d622e2e8353051b13` | 6600 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-03.md` | `82df0f7d4e36c844f76bfed4b23bd1ece6a46b53` | `82df0f7d4e36c844f76bfed4b23bd1ece6a46b53` | 16562 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-04-A1-reliability-observe.md` | `88fcc05dd273fbb361963435211e38447ea67a9c` | `88fcc05dd273fbb361963435211e38447ea67a9c` | 5967 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-04-A2-doctrine-orient.md` | `08f105bfae915c994d411e8ab86d421db03f9c42` | `08f105bfae915c994d411e8ab86d421db03f9c42` | 1834 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-04.md` | `649882d3a0bbb7939481f5f2bb43aea4f268b9c8` | `649882d3a0bbb7939481f5f2bb43aea4f268b9c8` | 16760 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-05-A1-reliability-observe.md` | `11701da8dff9882ef4e8d4f174abc062abd41404` | `11701da8dff9882ef4e8d4f174abc062abd41404` | 6137 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-05-A2-doctrine-orient.md` | `98139f531397d66bde60765a38f9b0c683d936ab` | `98139f531397d66bde60765a38f9b0c683d936ab` | 6438 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-05.md` | `b5ac70417e44bd8b7a8d2de04ad4daa5e4f71931` | `b5ac70417e44bd8b7a8d2de04ad4daa5e4f71931` | 11168 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-06-A1-reliability-observe.md` | `56abc25eca5f0e9e2aa537be5924c6045162815c` | `56abc25eca5f0e9e2aa537be5924c6045162815c` | 6238 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-06-A2-doctrine-orient.md` | `6cb80c4d899b533c539ad487b274c1b168db9724` | `6cb80c4d899b533c539ad487b274c1b168db9724` | 7015 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-06.md` | `2ad5c5ce4a3fc4228f089eaacf94109e4210a66f` | `2ad5c5ce4a3fc4228f089eaacf94109e4210a66f` | 9276 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-07-A1-reliability-observe.md` | `12c9266cc5f1fe0837a736e7ec9ed4505e7ba4a5` | `12c9266cc5f1fe0837a736e7ec9ed4505e7ba4a5` | 8403 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-07-A2-doctrine-orient.md` | `9bd6c75a310832f7cc58c9ae399f41acfdf4d950` | `9bd6c75a310832f7cc58c9ae399f41acfdf4d950` | 9117 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-07.md` | `7f20b476517f31e4d890e64880b2eeb4b8248bf7` | `7f20b476517f31e4d890e64880b2eeb4b8248bf7` | 11410 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-08-A1-reliability-observe.md` | `5c91de675c4dc78aba0f419ab5f7added9c29fd7` | `5c91de675c4dc78aba0f419ab5f7added9c29fd7` | 5910 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-08-A2-doctrine-orient.md` | `9815107064b4fed9aa0983143c4b329b5f28a675` | `9815107064b4fed9aa0983143c4b329b5f28a675` | 11624 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-08.md` | `8d24c4cfc5362b7c81b60a6888d875e6960342aa` | `8d24c4cfc5362b7c81b60a6888d875e6960342aa` | 21159 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-09-A1-reliability-observe.md` | `e5b385ba25e8a4ef9a68401080dab545592ddf4b` | `e5b385ba25e8a4ef9a68401080dab545592ddf4b` | 6609 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-09-A2-doctrine-orient.md` | `2f96bb0dd5891a93ec3e4b94410e4a4a44eb8124` | `2f96bb0dd5891a93ec3e4b94410e4a4a44eb8124` | 16037 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-09.md` | `cce84778a3f752461a1d82b9c38f5057f3950fd3` | `cce84778a3f752461a1d82b9c38f5057f3950fd3` | 12343 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-10-A1-reliability-observe.md` | `bfbe8f099a7413cdd5a8f1466a180d9e2d78f975` | `bfbe8f099a7413cdd5a8f1466a180d9e2d78f975` | 6407 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-10-A2-doctrine-orient.md` | `ce4f369d35fda91ddeeb975679a89ee4fe1f2314` | `ce4f369d35fda91ddeeb975679a89ee4fe1f2314` | 6626 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-10.md` | `d2702d66363b0e8a6ea645aff60a6475a1ca003c` | `d2702d66363b0e8a6ea645aff60a6475a1ca003c` | 13882 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-11-A1-reliability-observe.md` | `bc3c4ba9cf48045bb05f02e65901dd02ad5464f1` | `bc3c4ba9cf48045bb05f02e65901dd02ad5464f1` | 5959 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-11-A2-doctrine-orient.md` | `d3882e3530ce98550a10f93ba4221afbb270c83c` | `d3882e3530ce98550a10f93ba4221afbb270c83c` | 7757 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-11.md` | `b35c69acee29b194d597d3eedd942dd4cc7243a0` | `b35c69acee29b194d597d3eedd942dd4cc7243a0` | 15372 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-12-A1-reliability-observe.md` | `72d7f662d70f5c73301fd8bec7c8351f0e1a7349` | `72d7f662d70f5c73301fd8bec7c8351f0e1a7349` | 6876 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-12-A2-doctrine-orient.md` | `6ed3797a34699a9eae821c7bb2a8c8797459b17f` | `6ed3797a34699a9eae821c7bb2a8c8797459b17f` | 8336 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-12.md` | `02fe0896ac9c41ae336cda04e69f133460e0a742` | `02fe0896ac9c41ae336cda04e69f133460e0a742` | 9594 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-13-A1-reliability-observe.md` | `a5d0ca039bbe4b93b8b59e5e671bcf76ff82ba87` | `a5d0ca039bbe4b93b8b59e5e671bcf76ff82ba87` | 7596 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-13-A2-doctrine-orient.md` | `1404e3a91cb6f4b17a5ef3cbd121e1aade9b6d22` | `1404e3a91cb6f4b17a5ef3cbd121e1aade9b6d22` | 9874 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-13.md` | `cc09eb3e1746cf4e555880ab4304b28c63341a4c` | `cc09eb3e1746cf4e555880ab4304b28c63341a4c` | 16962 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-14-A1-reliability-observe.md` | `1def392d03eb7bb03c428d696d4acb923454112f` | `1def392d03eb7bb03c428d696d4acb923454112f` | 6178 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-14-A2-doctrine-orient.md` | `c7b33ecece64b24d54f2c68edd5fcbe7d9d5fbdd` | `c7b33ecece64b24d54f2c68edd5fcbe7d9d5fbdd` | 7932 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-14.md` | `98a752267cd0c2beff5d2770ecf1672a6c869e3b` | `98a752267cd0c2beff5d2770ecf1672a6c869e3b` | 18894 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-15-A1-reliability-observe.md` | `293272cf6ae77efc28491dc69597d0652f4ca751` | `293272cf6ae77efc28491dc69597d0652f4ca751` | 7671 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-15-A2-doctrine-orient.md` | `896901e892647ab19b584fa077363afc5e4e89ab` | `896901e892647ab19b584fa077363afc5e4e89ab` | 3670 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-15.md` | `2f94b0b736cd8e3ffda03794462a12d3b50a3bc3` | `2f94b0b736cd8e3ffda03794462a12d3b50a3bc3` | 9229 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-16-A1-reliability-observe.md` | `372a99054cd4cd55ac909304b4c44a702376bcf6` | `372a99054cd4cd55ac909304b4c44a702376bcf6` | 5743 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-16-A2-doctrine-orient.md` | `454d6a632ad13c2fdacbfa27a30d0a565427026f` | `454d6a632ad13c2fdacbfa27a30d0a565427026f` | 6642 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-16.md` | `5cf129e2d6d31ce14171ac3e2b0c6ea0a3bddee0` | `5cf129e2d6d31ce14171ac3e2b0c6ea0a3bddee0` | 10297 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-17-A1-reliability-observe.md` | `32bc7fefb64671e1c09347d03231034fd3d28cda` | `32bc7fefb64671e1c09347d03231034fd3d28cda` | 6621 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-17-A2-doctrine-orient.md` | `7d839226fcf975325c8a5813e706b6e05f09aeeb` | `7d839226fcf975325c8a5813e706b6e05f09aeeb` | 7415 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-17.md` | `4f76b71274f8a72434ca0a02af8d48a18842dbb3` | `4f76b71274f8a72434ca0a02af8d48a18842dbb3` | 11965 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-18-A1-reliability-observe.md` | `cb4df7bb2ca43662643354bf531a10dde9e75ffd` | `cb4df7bb2ca43662643354bf531a10dde9e75ffd` | 5728 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-18-A2-doctrine-orient.md` | `de4fa530ab13e81aedb672701392680d2bd83925` | `de4fa530ab13e81aedb672701392680d2bd83925` | 3670 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-18.md` | `9d0aa4b7d2dc10b59221ae91be580c1f35f92e61` | `9d0aa4b7d2dc10b59221ae91be580c1f35f92e61` | 13441 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-19-A1-reliability-observe.md` | `f0edcb5ce06fbc06a5c0ce6a4454607121915be2` | `f0edcb5ce06fbc06a5c0ce6a4454607121915be2` | 8532 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-19-A2-doctrine-orient.md` | `6a9798bba6967b020ddc9bf4542b3404e421d24b` | `6a9798bba6967b020ddc9bf4542b3404e421d24b` | 8251 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-19.md` | `84488c6de94120a49a909937571e46bfcdb09505` | `84488c6de94120a49a909937571e46bfcdb09505` | 7542 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-20-A1-reliability-observe.md` | `4adfe9ac3a6321031afec2daad0609ee5db0d209` | `4adfe9ac3a6321031afec2daad0609ee5db0d209` | 11398 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-20-A2-doctrine-orient.md` | `14c2e2d8dcc85fc007ba8392111960ad194ba996` | `14c2e2d8dcc85fc007ba8392111960ad194ba996` | 15588 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-20.md` | `86adc547bc9a745f4f0508614887e6569c7d43e9` | `86adc547bc9a745f4f0508614887e6569c7d43e9` | 7129 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-21-A1-reliability-observe.md` | `9c397544e16158d0eac8751798fdc894950fa2d0` | `9c397544e16158d0eac8751798fdc894950fa2d0` | 8493 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-21-A2-doctrine-orient.md` | `3bee2ab7f45d9be1aaa285ccc08e703200ce6685` | `3bee2ab7f45d9be1aaa285ccc08e703200ce6685` | 6514 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-21.md` | `1d6f82a47c714da7c79cb951a8eba9ecd969ea1f` | `1d6f82a47c714da7c79cb951a8eba9ecd969ea1f` | 10878 | NO_FOLLOW_UP / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-22-A1-reliability-observe.md` | — | `97f64b6c675e716952843ff7da3d9c5b65fe1c86` | 12786 | NEW_N_MINUS_1_NATIVE_INPUT / PRESERVE_TASK_TIME_STATUS |
| `aegis-cortex/2026-10-22-A2-doctrine-orient.md` | — | `57671395b124905190d924e698b67a299ed4e6ce` | 10636 | NEW_N_MINUS_1_NATIVE_INPUT / PRESERVE_TASK_TIME_STATUS |
| `ballast/records/2026-10-22.md` | — | `d0989c17f7f3412dd1f8902802500ba5ca06fc51` | 16260 | NEW_N_MINUS_1_NATIVE_INPUT / PRESERVE_TASK_TIME_STATUS |

## Current N-day objects intentionally excluded from the N−1 cutoff

| Source path | Live main Git blob | Bytes | A1 disposition |
|---|---|---:|---|
| `aegis-cortex/2026-10-23-A1-reliability-observe.md` | `a48c1172dee8b8c76c99ca0a9baa2b31d67d1019` | 10487 | N_DAY_INPUT_EXCLUDED_FROM_A1 / ADMIT_ONLY_AFTER_FRESH_MAIN_IN_A2 |
| `aegis-cortex/2026-10-23-A2-doctrine-orient.md` | `a46cde6671b65d40f5110805aa7f40cadd4068d4` | 8921 | N_DAY_INPUT_EXCLUDED_FROM_A1 / ADMIT_ONLY_AFTER_FRESH_MAIN_IN_A2 |
| `ballast/records/2026-10-23.md` | `4c96e39a7a2438ac4ba654eacaaf2645bd249e3f` | 14390 | N_DAY_INPUT_EXCLUDED_FROM_A1 / ADMIT_ONLY_AFTER_FRESH_MAIN_IN_A2 |

## Historical status and authority boundaries

- 2026-10-22 Aegis A1 is SUCCESS, but the same-date original Aegis A2 is BLOCKED with INPUT_MISSING / CURRENT_PATH_MISSING at task time; do not convert it into success because its path later appears
- 2026-10-22 Ballast is PARTIAL / BOUNDED_MODEL_ONLY; modeled scenarios and verifier results are not live external effect evidence
- 2026-10-23 Aegis A2 is a separate GPT-native bounded orientation, not a Jules A2 execution; 2026-10-23 Ballast remains PARTIAL / BOUNDED_MODEL_ONLY with real Redis calls and external effects at zero
- Preserve EXTERNAL_RISK_CLASS, LOCAL_INCIDENT, LOCAL_RUNTIME_OUTCOME, AUTHORITATIVE_EXTERNAL_EFFECT and UNRESOLVED as separate classes
- No original Aegis, Ballast, Host Kernel, SQLite/JSONL/hash-chain state, historical daily or monthly owner was modified
- No new experiment, CASE, independent execution window or local incident is created by this A1
- Native runtime replay, full repository tests and external-source recertification: NOT_EXECUTED by this audit
- Files changed by this proposal: this dated A1 source-custody record only
- Next gate: merge all ten A1 deliveries, reread current main, then create the A2 month-wide relation through 2026-10-23

## Result

`A1_SOURCE_CUSTODY / PRESERVED_BLOCKED_AND_PARTIAL_STATES / N_MINUS_1_CUTOFF_2026-10-22 / MONTH_OPEN`

