<?php
                $array=array(
                                 "User"=>"fbesopianeto",
                                 "Pass"=>"besopianeto12345",
                                 "Device"=>"ecf4f6a8-f0db-4103-a2dd-49a4d00915af"
                            );
                
                $datosCodificados = json_encode($array);
                $url = "http://pdr.nectica.com/api/login";
                $ch = curl_init($url);
                curl_setopt_array($ch, array(
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => $datosCodificados,
                    CURLOPT_HTTPHEADER => array(
                        'Content-Type: application/json',
                        'Content-Length: ' . strlen($datosCodificados)
                    ),
                    CURLOPT_RETURNTRANSFER => true,
                ));
                $resultado = curl_exec($ch);
                $codigoRespuesta = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                
                print_r($resultado);
?>