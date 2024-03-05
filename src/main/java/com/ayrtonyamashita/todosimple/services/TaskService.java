package com.ayrtonyamashita.todosimple.services;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayrtonyamashita.todosimple.models.Task;
import com.ayrtonyamashita.todosimple.models.User;
import com.ayrtonyamashita.todosimple.repositories.TaskRepository;
import com.ayrtonyamashita.todosimple.services.exceptions.DataBindingViolationException;
import com.ayrtonyamashita.todosimple.services.exceptions.ObjectNotFoundException;

@Service
public class TaskService {
    

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    public Task findById(Long id){
        Optional<Task> task = this.taskRepository.findById(id);
        return task.orElseThrow(() -> new ObjectNotFoundException(
            "Tarefa não encontrada! Id: " + id + ", Tipo: " + Task.class.getName()
        ));
    }

    public List<Task> findAllbyUID(Long id){
        List<Task> task = this.taskRepository.findByUser_Id(id);
        return task;
    }

    @Transactional
    public Task create(Task obj){
        User user = this.userService.findById(obj.getUser().getId());
        obj.setId(null);
        obj.setUser(user);
        obj = this.taskRepository.save(obj);

        return obj;
    }

    @Transactional
    public Task update(Task obj){
        Task newObj = findById(obj.getId());
        newObj.setDescription(obj.getDescription());

        return this.taskRepository.save(newObj);
    }

    @Transactional
    public void delete(Long id){
        findById(id);
        try {
            this.taskRepository.deleteById(id);
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possível deletar pois há entidades relacionadas!");
        }
    }


}
