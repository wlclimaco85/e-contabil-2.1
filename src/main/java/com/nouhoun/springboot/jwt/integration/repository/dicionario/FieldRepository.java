/** create by system gera-java version 1.0.0 20/11/2018 22:53 : 45*/


package com.nouhoun.springboot.jwt.integration.repository.dicionario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nouhoun.springboot.jwt.api.PaginationFilter;
import com.nouhoun.springboot.jwt.integration.domain.dicionario.Field;

@Repository("FieldRepository")
public interface FieldRepository extends JpaRepository<Field, Long> {

Field findFieldById(Integer id);

List<Field> findFieldAll(PaginationFilter filter);


}
